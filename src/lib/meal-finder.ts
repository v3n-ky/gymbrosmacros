import { MenuItem } from '@/types/menu';
import { MacroTargets } from '@/types/meal';

export interface FinderResult {
  item: MenuItem;
  matchScore: number; // 0-100, higher is better
  distance: number;   // absolute macro distance (lower is better)
}

/** Find menu items across all restaurants that match the target macros */
export function findMatchingItems(
  allItems: MenuItem[],
  targets: MacroTargets,
  options?: {
    restaurantFilter?: string[];
    categoryFilter?: string[];
    maxResults?: number;
  }
): FinderResult[] {
  const maxResults = options?.maxResults ?? 20;

  let items = allItems;

  if (options?.restaurantFilter?.length) {
    items = items.filter((i) =>
      options.restaurantFilter!.includes(i.restaurantSlug)
    );
  }

  if (options?.categoryFilter?.length) {
    items = items.filter((i) =>
      options.categoryFilter!.includes(i.category)
    );
  }

  const results: FinderResult[] = items.map((item) => {
    const distance = computeDistance(item, targets);
    const matchScore = computeMatchScore(item, targets);
    return { item, matchScore, distance };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);

  return results.slice(0, maxResults);
}

function computeDistance(item: MenuItem, targets: MacroTargets): number {
  let distance = 0;
  const m = item.baseMacros;

  if (targets.calories != null) {
    distance += Math.abs(m.calories - targets.calories) / Math.max(targets.calories, 1);
  }
  if (targets.protein != null) {
    distance += Math.abs(m.protein - targets.protein) / Math.max(targets.protein, 1);
  }
  if (targets.carbs != null) {
    distance += Math.abs(m.carbs - targets.carbs) / Math.max(targets.carbs, 1);
  }
  if (targets.fat != null) {
    distance += Math.abs(m.fat - targets.fat) / Math.max(targets.fat, 1);
  }

  return distance;
}

function computeMatchScore(item: MenuItem, targets: MacroTargets): number {
  const distance = computeDistance(item, targets);
  // Count how many targets are set
  const targetCount = [targets.calories, targets.protein, targets.carbs, targets.fat]
    .filter((t) => t != null).length;

  if (targetCount === 0) return 50;

  // Normalise: distance is sum of relative errors, so max reasonable distance ~ targetCount
  const normalisedDistance = distance / targetCount;

  // Convert to 0-100 score (closer = higher)
  const score = Math.max(0, Math.round((1 - normalisedDistance) * 100));
  return score;
}
