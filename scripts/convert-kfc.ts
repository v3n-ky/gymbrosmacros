/**
 * Converts scraped KFC API data into our MenuItem format.
 * Run with: npx tsx scripts/convert-kfc.ts
 *
 * Outputs: src/data/kfc/menu.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

interface NutritionComponent {
  nutritionComponent: string;
  nutritionUnit: string;
  serveWiseValue: number;
  gramWiseValue: number;
  isActive: boolean;
}

interface KFCItem {
  id: string;
  name: string;
  url?: string;
  content?: {
    nutritionalInformation?: NutritionComponent[];
    longDescription?: string;
  };
  shortDescription?: { lang: string; value: string }[];
}

interface KFCCategory {
  id: string;
  name: string;
  categories?: KFCCategory[];
  products?: { items?: KFCItem[] }[];
}

function getNutrient(info: NutritionComponent[], name: string): number {
  const found = info.find(n => n.nutritionComponent === name);
  return found ? Math.round(found.serveWiseValue * 10) / 10 : 0;
}

function getServingSize(info: NutritionComponent[]): string {
  const found = info.find(n => n.nutritionComponent === 'Average serving size');
  return found ? `${found.serveWiseValue}g` : '';
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Collect all items with nutrition data, preserving category context
function collectItems(
  categories: KFCCategory[],
  parentCategory = '',
): { item: KFCItem; category: string }[] {
  const results: { item: KFCItem; category: string }[] = [];

  for (const cat of categories) {
    const catName = cat.name === 'Menu' ? parentCategory : cat.name;

    // Recurse into sub-categories
    if (cat.categories?.length) {
      results.push(...collectItems(cat.categories, catName));
    }

    // Collect products
    for (const product of cat.products ?? []) {
      for (const item of product.items ?? []) {
        const nutrition = item.content?.nutritionalInformation;
        if (nutrition && nutrition.length > 0 && item.name) {
          const kj = nutrition.find(n => n.nutritionComponent === 'Energy')?.serveWiseValue ?? 0;
          if (kj === 0) continue; // skip zero-energy items (e.g. Bottled Water)
          results.push({ item, category: catName });
        }
      }
    }
  }

  return results;
}

// Normalize category names to match our conventions
function normalizeCategory(raw: string): string {
  const map: Record<string, string> = {
    'FEATURED OFFERS': 'Featured',
    "COLONEL'S OFFERS": 'Featured',
    'EVERYDAY VALUE': 'Value Meals',
    'BURGERS': 'Burgers',
    'CHICKEN': 'Chicken',
    'TENDERS': 'Chicken',
    'POPCORN CHICKEN': 'Chicken',
    'NUGGETS': 'Chicken',
    'PROTEIN PICKS': 'Chicken',
    'SNACK HACKS': 'Snacks & Sides',
    'SNACKS & SIDES': 'Snacks & Sides',
    'SIDES & DESSERTS': 'Snacks & Sides',
    'CHIPS': 'Snacks & Sides',
    'WRAPS': 'Wraps & Bowls',
    'TWISTERS & BOWLS': 'Wraps & Bowls',
    'SALADS': 'Wraps & Bowls',
    'BOXED MEALS': 'Box Meals',
    'SHARED MEALS': 'Box Meals',
    'GO BUCKETS & KIDS MEALS': 'Box Meals',
    'COLD DRINKS': 'Drinks',
    'DESSERTS & DRINKS': 'Drinks',
    'DRINKS': 'Drinks',
    'KIDS': 'Box Meals',
    'COMBO MEALS': 'Box Meals',
  };
  const normalized = map[raw.toUpperCase()];
  if (!normalized) {
    console.warn(`[convert-kfc] Unknown category: "${raw}" — passing through verbatim. Add it to normalizeCategory().`);
  }
  return normalized ?? raw;
}

// Category specificity priority — lower index = more canonical.
// Promotional / catch-all buckets (Featured, Value Meals) are deprioritised
// so that the same item first seen in FEATURED OFFERS still ends up under
// its true home (Burgers, Chicken, etc.) when a better occurrence exists.
const CATEGORY_PRIORITY: string[] = [
  'Drinks', 'Wraps & Bowls', 'Chicken', 'Burgers', 'Snacks & Sides',
  'Box Meals', 'Value Meals', 'Featured',
];
function categoryRank(cat: string): number {
  const idx = CATEGORY_PRIORITY.indexOf(cat);
  return idx === -1 ? CATEGORY_PRIORITY.length : idx;
}

const apiData = JSON.parse(readFileSync(join(__dirname, 'kfc-api-responses.json'), 'utf-8'));
// Use the Generic menu (index 4) as it's the most complete
const genericMenu = apiData[4].data as { id: string; categories: KFCCategory[] };

const collected = collectItems(genericMenu.categories);

// Deduplicate by slug, keeping the occurrence with the most canonical category.
// e.g. Zinger Burger appearing in FEATURED OFFERS first should end up under Burgers.
const bySlug = new Map<string, { item: KFCItem; category: string }>();
for (const entry of collected) {
  const slug = `kfc-${slugify(entry.item.name!)}`;
  const existing = bySlug.get(slug);
  if (!existing || categoryRank(normalizeCategory(entry.category)) < categoryRank(normalizeCategory(existing.category))) {
    bySlug.set(slug, entry);
  }
}
const unique = [...bySlug.values()];

console.log(`Total unique items with nutrition: ${unique.length}`);

// Build category list (unique, ordered by first appearance)
const categoryOrder: string[] = [];
for (const { category } of unique) {
  const normalized = normalizeCategory(category);
  if (!categoryOrder.includes(normalized)) categoryOrder.push(normalized);
}

// Build menu items
const menuItems = unique.map(({ item, category }) => {
  const info = item.content!.nutritionalInformation!;
  const kjEnergy = getNutrient(info, 'Energy');
  // 4.184 kJ = 1 kcal (thermochemical definition used on Australian food labels)
  const KJ_PER_KCAL = 4.184;
  const calories = Math.round(kjEnergy / KJ_PER_KCAL);
  const protein = getNutrient(info, 'Protein');
  const fat = getNutrient(info, 'Fat, total');
  const carbs = getNutrient(info, 'Carbohydrate');
  const sugar = getNutrient(info, 'Carbohydrate, sugars');
  const sodium = Math.round(getNutrient(info, 'Sodium')); // already in mg
  const servingSize = getServingSize(info);
  const normalizedCat = normalizeCategory(category);

  const desc =
    item.shortDescription?.find(d => d.lang === 'en-US')?.value ??
    item.content?.longDescription ??
    '';

  // ── Allergen helpers ──────────────────────────────────────────────────────
  const allergens = item.content?.allergenInformation ?? [];
  const hasAllergenData = allergens.length > 0;

  const hasGluten = allergens.some(
    (a) => a.allergenComponent.toLowerCase().includes('gluten') && a.isPresent
  );
  const hasMilk = allergens.some(
    (a) => a.allergenComponent.toLowerCase().includes('milk') && a.isPresent
  );
  const hasEgg = allergens.some(
    (a) => a.allergenComponent.toLowerCase().includes('egg') && a.isPresent
  );
  const hasFish = allergens.some(
    (a) => a.allergenComponent.toLowerCase().includes('fish') && a.isPresent
  );
  const hasCrustacea = allergens.some(
    (a) => a.allergenComponent.toLowerCase().includes('crustacea') && a.isPresent
  );

  // Combos/boxes/feasts carry bundled items — their allergen data is unreliable.
  // Note: "pack" and "box" could theoretically appear in a standalone item name;
  // this heuristic errs on the side of caution (no false GF tags on bundles).
  const isBundled = /combo|feast|box|pack|deal|lunch|dinner/i.test(item.name ?? '');

  // Name-based drink detection: some beverages first appear under SNACK HACKS
  // in the API (a promotional bundle section), so their normalised category ends
  // up as "Snacks & Sides" instead of "Drinks". Detect them by name so they
  // always receive the correct tags regardless of which API category wins.
  const isDrinkByName = /pepsi|solo|mountain dew|lemonade|7up|sparkling water|sunkist|freeze|lipton|apple juice|ice tea/i.test(item.name ?? '');

  // ── Tag assignment ─────────────────────────────────────────────────────────
  const tags: string[] = [];

  if (normalizedCat === 'Drinks' || isDrinkByName) {
    tags.push('drink');
    // Drinks with no animal allergens are vegan
    if (!hasMilk && !hasEgg && !hasFish && !hasCrustacea) {
      tags.push('vegan');
      tags.push('vegetarian');
    }
  } else if (normalizedCat === 'Snacks & Sides') {
    const lowerName = (item.name ?? '').toLowerCase();
    const hasMeat = /chicken|nugget|tender|popcorn|wicked|gravy|slider|wing/.test(lowerName);
    if (hasMeat) {
      tags.push('contains-meat');
    } else {
      // Coleslaw, dips, chips, sauces — no meat.
      // Note: vegan/vegetarian here reflects ingredients only. KFC chips are
      // fried in shared oil with chicken; cross-contamination is not captured.
      if (!hasMilk && !hasEgg && !hasFish && !hasCrustacea) {
        tags.push('vegan');
        tags.push('vegetarian');
      } else {
        tags.push('vegetarian');
      }
    }
  } else {
    tags.push('contains-meat');
  }

  // Gluten-free: only tag if allergen data present and not a bundled meal
  if (hasAllergenData && !hasGluten && !isBundled) {
    tags.push('gluten-free-option');
  }

  return {
    id: `kfc-${slugify(item.name!)}`,
    restaurantSlug: 'kfc',
    name: item.name!,
    category: normalizedCat,
    ...(desc ? { description: desc } : {}),
    baseMacros: {
      calories,
      protein,
      carbs,
      fat,
      ...(sugar > 0 ? { sugar } : {}),
      ...(sodium > 0 ? { sodium } : {}),
    },
    ...(servingSize ? { servingSize } : {}),
    isPopular: false,
    tags,
  };
});

// Render TypeScript source
const lines: string[] = [
  `import type { MenuItem } from '../../types/menu';`,
  ``,
  `export const kfcMenu: MenuItem[] = [`,
];

for (const item of menuItems) {
  lines.push(`  {`);
  lines.push(`    id: ${JSON.stringify(item.id)},`);
  lines.push(`    restaurantSlug: 'kfc',`);
  lines.push(`    name: ${JSON.stringify(item.name)},`);
  lines.push(`    category: ${JSON.stringify(item.category)},`);
  if (item.description) {
    lines.push(`    description: ${JSON.stringify(item.description)},`);
  }
  lines.push(`    baseMacros: {`);
  lines.push(`      calories: ${item.baseMacros.calories},`);
  lines.push(`      protein: ${item.baseMacros.protein},`);
  lines.push(`      carbs: ${item.baseMacros.carbs},`);
  lines.push(`      fat: ${item.baseMacros.fat},`);
  if (item.baseMacros.sugar) lines.push(`      sugar: ${item.baseMacros.sugar},`);
  if (item.baseMacros.sodium) lines.push(`      sodium: ${item.baseMacros.sodium},`);
  lines.push(`    },`);
  if (item.servingSize) lines.push(`    servingSize: ${JSON.stringify(item.servingSize)},`);
  lines.push(`    isPopular: false,`);
  lines.push(`    tags: ${JSON.stringify(item.tags)},`);
  lines.push(`  },`);
}

lines.push(`];`);
lines.push(``);

const outDir = join(ROOT, 'src/data/kfc');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'menu.ts');
writeFileSync(outPath, lines.join('\n'));
console.log(`Written to ${outPath}`);
console.log(`Categories: ${categoryOrder.join(', ')}`);
