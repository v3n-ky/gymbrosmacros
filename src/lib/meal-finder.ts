import { MenuItem, CustomizationGroup } from '@/types/menu';
import { MacroTargets } from '@/types/meal';
import { Macros } from '@/types/macros';
import { computeItemMacros } from '@/lib/macros';

export interface FinderVariant {
  selectedOptions: Record<string, string[]>;
  computedMacros: Macros;
  matchScore: number; // 0-100, higher is better
  distance: number;   // sum of relative errors (lower is better)
}

export interface FinderResult {
  item: MenuItem;
  variants: FinderVariant[]; // sorted desc by matchScore, up to maxVariants
  bestVariant: FinderVariant; // shortcut for variants[0]
}

/** Find menu items across all restaurants that best match the target macros.
 *  For each item, the algorithm finds the best customization configuration(s)
 *  via exhaustive search over required groups + greedy selection over optional groups. */
export function findMatchingItems(
  allItems: MenuItem[],
  targets: MacroTargets,
  options?: {
    restaurantFilter?: string[];
    categoryFilter?: string[];
    maxResults?: number;
    maxVariants?: number;
  }
): FinderResult[] {
  const maxResults = options?.maxResults ?? 20;
  const maxVariants = options?.maxVariants ?? 3;

  let items = allItems;

  if (options?.restaurantFilter?.length) {
    items = items.filter((i) => options.restaurantFilter!.includes(i.restaurantSlug));
  }
  if (options?.categoryFilter?.length) {
    items = items.filter((i) => options.categoryFilter!.includes(i.category));
  }

  return items
    .map((item) => {
      const variants = findBestVariants(item, targets, maxVariants);
      return { item, variants, bestVariant: variants[0] };
    })
    .sort((a, b) => b.bestVariant.matchScore - a.bestVariant.matchScore)
    .slice(0, maxResults);
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant generation
// ─────────────────────────────────────────────────────────────────────────────

/** All valid selection sets for a required group.
 *  Single-select  → one entry per option.
 *  Multi halfAndHalf or maxSelections≥2 → singles + all pairs.
 *  Multi otherwise → singles only. */
function getRequiredSelections(group: CustomizationGroup): string[][] {
  const ids = group.options.map((o) => o.id);

  if (group.type === 'single') {
    return ids.map((id) => [id]);
  }

  const candidates: string[][] = ids.map((id) => [id]);

  if (group.halfAndHalf || (group.maxSelections != null && group.maxSelections >= 2)) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        candidates.push([ids[i], ids[j]]);
      }
    }
  }

  return candidates;
}

/** Cartesian product of per-group selection arrays → array of selectedOptions objects. */
function cartesianProduct(
  groups: Array<{ id: string; selections: string[][] }>
): Record<string, string[]>[] {
  return groups.reduce<Record<string, string[]>[]>(
    (acc, { id, selections }) =>
      acc.flatMap((existing) => selections.map((sel) => ({ ...existing, [id]: sel }))),
    [{}]
  );
}

/** For an optional group, pick the selection that minimises distance to targets.
 *  Ties are broken in favour of the group's default option (or [] if no default). */
function greedyPickOptional(
  item: MenuItem,
  currentSel: Record<string, string[]>,
  group: CustomizationGroup,
  targets: MacroTargets
): string[] {
  const defaultId =
    group.defaultOptionId ?? group.options.find((o) => o.isDefault)?.id ?? null;
  const defaultSel: string[] = defaultId ? [defaultId] : [];

  const ids = group.options.map((o) => o.id);
  const candidates: string[][] = [[], ...ids.map((id) => [id])];

  if (group.halfAndHalf || (group.maxSelections != null && group.maxSelections >= 2)) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        candidates.push([ids[i], ids[j]]);
      }
    }
  }

  // Initialise from the default (tiebreaker: prefer the explicit default over empty)
  const defaultMacros = computeItemMacros(item, { ...currentSel, [group.id]: defaultSel });
  let bestDist = computeDistance(defaultMacros, targets);
  let bestSel = defaultSel;

  for (const candidate of candidates) {
    // Skip re-evaluating the default (already the baseline)
    if (candidate.length === defaultSel.length && candidate.every((id, i) => id === defaultSel[i])) {
      continue;
    }
    const testMacros = computeItemMacros(item, { ...currentSel, [group.id]: candidate });
    const d = computeDistance(testMacros, targets);
    if (d < bestDist) {
      bestDist = d;
      bestSel = candidate;
    }
  }

  return bestSel;
}

function findBestVariants(
  item: MenuItem,
  targets: MacroTargets,
  maxVariants: number
): FinderVariant[] {
  const groups = item.customizationGroups ?? [];
  const requiredGroups = groups.filter((g) => g.required);
  const optionalGroups = groups.filter((g) => !g.required);

  // Exhaustive search over required groups
  const requiredCombinations = cartesianProduct(
    requiredGroups.map((g) => ({ id: g.id, selections: getRequiredSelections(g) }))
  );

  const seen = new Set<string>();
  const variants: FinderVariant[] = [];

  for (const reqSel of requiredCombinations) {
    // Greedily extend with the best optional group choices
    let sel = { ...reqSel };
    for (const group of optionalGroups) {
      const best = greedyPickOptional(item, sel, group, targets);
      sel = { ...sel, [group.id]: best };
    }

    const key = JSON.stringify(sel);
    if (seen.has(key)) continue;
    seen.add(key);

    const computedMacros = computeItemMacros(item, sel);
    const matchScore = computeMatchScore(computedMacros, targets);
    const distance = computeDistance(computedMacros, targets);
    variants.push({ selectedOptions: sel, computedMacros, matchScore, distance });
  }

  return variants
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxVariants);
}

// ─────────────────────────────────────────────────────────────────────────────
// Scoring
// ─────────────────────────────────────────────────────────────────────────────

function computeDistance(macros: Macros, targets: MacroTargets): number {
  let distance = 0;
  if (targets.calories != null)
    distance += Math.abs(macros.calories - targets.calories) / Math.max(targets.calories, 1);
  if (targets.protein != null)
    distance += Math.abs(macros.protein - targets.protein) / Math.max(targets.protein, 1);
  if (targets.carbs != null)
    distance += Math.abs(macros.carbs - targets.carbs) / Math.max(targets.carbs, 1);
  if (targets.fat != null)
    distance += Math.abs(macros.fat - targets.fat) / Math.max(targets.fat, 1);
  return distance;
}

function computeMatchScore(macros: Macros, targets: MacroTargets): number {
  const distance = computeDistance(macros, targets);
  const targetCount = [targets.calories, targets.protein, targets.carbs, targets.fat].filter(
    (t) => t != null
  ).length;

  if (targetCount === 0) return 50;

  const normalisedDistance = distance / targetCount;
  return Math.max(0, Math.round((1 - normalisedDistance) * 100));
}

// ─────────────────────────────────────────────────────────────────────────────
// Label helpers (used by FinderResults)
// ─────────────────────────────────────────────────────────────────────────────

/** Short label for variant tabs — shows required group choices (or first key optional choices). */
export function variantTabLabel(
  item: MenuItem,
  selectedOptions: Record<string, string[]>
): string {
  const groups = item.customizationGroups ?? [];
  const parts: string[] = [];

  // Prefer required groups for the label
  for (const group of groups.filter((g) => g.required)) {
    const sel = selectedOptions[group.id] ?? [];
    const names = sel.map((id) => group.options.find((o) => o.id === id)?.name ?? id);
    if (names.length) parts.push(names.join(' & '));
    if (parts.length >= 2) break;
  }

  // Fallback: first non-default optional selection
  if (parts.length === 0) {
    for (const group of groups.filter((g) => !g.required)) {
      const sel = selectedOptions[group.id] ?? [];
      const defaultId = group.defaultOptionId ?? group.options.find((o) => o.isDefault)?.id;
      if (sel.length > 0 && !(sel.length === 1 && sel[0] === defaultId)) {
        const names = sel.map((id) => group.options.find((o) => o.id === id)?.name ?? id);
        parts.push(names.join(' & '));
        if (parts.length >= 2) break;
      }
    }
  }

  return parts.join(' · ') || 'Standard';
}

/** Full "how to order" label — shows non-default selections and explicitly skipped defaults. */
export function buildOrderLabel(
  item: MenuItem,
  selectedOptions: Record<string, string[]>
): string {
  const parts: string[] = [];

  for (const group of item.customizationGroups ?? []) {
    const sel = selectedOptions[group.id] ?? [];
    const defaultId = group.defaultOptionId ?? group.options.find((o) => o.isDefault)?.id;

    if (sel.length === 0) {
      // Show "No X" only when a meaningful default is being explicitly skipped
      if (defaultId) parts.push(`No ${group.name}`);
      continue;
    }

    // Skip if the selection is exactly the default (nothing interesting to note)
    if (sel.length === 1 && sel[0] === defaultId) continue;

    const names = sel.map((id) => group.options.find((o) => o.id === id)?.name ?? id);
    parts.push(names.join(' & '));
  }

  return parts.join(' · ');
}
