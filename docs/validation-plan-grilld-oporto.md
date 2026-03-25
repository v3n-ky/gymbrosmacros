# Validation Plan: Grill'd & Oporto Menu Data

## Status
- Grill'd: ❌ Not validated — values are estimates, no official source cross-check
- Oporto: ❌ Not validated — values are estimates, no official source cross-check

## Sources to use

| Restaurant | Nutrition source | Notes |
|------------|-----------------|-------|
| Grill'd | https://www.grilld.com.au/menu | Per-item kJ/protein shown on menu page; no PDF available |
| Oporto | https://www.oporto.com.au/nutrition | Dedicated nutrition page with downloadable PDF |

---

## Grill'd — items to validate

Base macros (Traditional Bun + Beef patty unless noted):

| Item | Current cal | Current protein | Current carbs | Current fat |
|------|-------------|-----------------|---------------|-------------|
| Simply Grilled Chicken Burger | 480 | 38g | 36g | 18g |
| Crispy Bacon & Cheese | 680 | 36g | 42g | 38g |
| Garden Goodness | 520 | 18g | 52g | 26g |
| Beefy Deluxe | 620 | 40g | 38g | 32g |
| Sweet Chilli Chicken | 540 | 34g | 44g | 22g |
| Healthy Chicken Caesar Salad | 380 | 32g | 16g | 22g |
| Super Greens Salad | 320 | 12g | 28g | 18g |
| Sweet Potato Fries | 340 | 4g | 48g | 14g |
| Herbed Chips | 380 | 6g | 52g | 16g |

Customization deltas to validate:
- Bun options: Low Carb (-60 cal, -20g carbs, +4g fat), GF (-20 cal, -8g carbs), Lettuce Wrap (-120 cal, -32g carbs, -2g fat)
- Patty swap to Chicken: -40 cal, +2g protein, -4g fat
- Patty swap to Plant-Based: -20 cal, -8g protein, +6g carbs, +2g fat
- Extras: Extra Patty (250 cal, 20g P, 16g F), Bacon (80 cal, 6g P, 6g F), Avocado (70 cal, 6g F), Cheese (60 cal, 4g P, 5g F)

---

## Oporto — items to validate

Base macros (Regular size, Original Chilli sauce):

| Item | Current cal | Current protein | Current carbs | Current fat |
|------|-------------|-----------------|---------------|-------------|
| Bondi Burger | 520 | 28g | 42g | 24g |
| Double Bondi Burger | 720 | 44g | 44g | 38g |
| Chicken Rappa | 480 | 26g | 48g | 18g |
| Grilled Chicken Rappa | 420 | 30g | 44g | 14g |
| Pulled Chicken Bowl | 510 | 36g | 52g | 16g |
| Grilled Chicken Bowl | 480 | 38g | 48g | 14g |
| Original Chilli Chicken Burger | 560 | 30g | 46g | 26g |
| Chicken Tenders 5pc | 440 | 32g | 28g | 22g |

Customization deltas to validate:
- Junior size delta: -150 cal, -10g P, -14g carbs, -8g fat
- Sauce: Lemon Herb (+10 cal), Garlic Aioli (+80 cal, +9g fat)
- Extras: Extra Chicken (100 cal, 16g P, 4g fat), Cheese (50 cal, 3g P, 4g fat), Bacon (80 cal, 6g P, 6g fat), Avocado (70 cal, 6g fat)

---

## Validation steps

### Step 1 — Fetch official values
1. Open https://www.grilld.com.au/menu in a real browser
   - Click each burger/salad/side — the product page shows kJ and protein
   - Convert kJ → kcal (divide by 4.184)
   - Record protein, carbs, fat from allergen info if shown
2. Open https://www.oporto.com.au/nutrition
   - Download the PDF if available
   - Record values for each item (Regular size, no extras)

### Step 2 — Compare and fix discrepancies
- Tolerance: ±5% or ±5g/kcal (whichever is larger) for rounding differences
- Any discrepancy > tolerance → update `baseMacros` in the menu file
- Check customization deltas against option-swap values where shown

### Step 3 — Write validation tests
Pattern to follow: `src/__tests__/fishbowl-pdf-validation.test.ts`

For each item:
```typescript
it('Bondi Burger base macros match Oporto nutrition page', () => {
  const item = oportoMenu.find(i => i.id === 'oporto-bondi-burger')!;
  const macros = computeItemMacros(item, {});
  expect(macros.calories).toBeCloseTo(XXX, -1); // ±10 cal tolerance
  expect(macros.protein).toBeCloseTo(XX, 0);
  expect(macros.carbs).toBeCloseTo(XX, 0);
  expect(macros.fat).toBeCloseTo(XX, 0);
});
```

### Step 4 — Update lastUpdated and add source comment
In each menu file, add a top comment with the source and date:
```typescript
/**
 * Source: Oporto Nutrition Guide (oporto.com.au/nutrition) — verified March 2026
 * Tolerance: ±5 cal / ±2g macros
 */
```

---

## Items likely to need correction

Based on known patterns from other Australian fast food chains:
- Grill'd calorie counts are likely **higher than estimated** — real burgers on buns typically run 600–800+ cal
- Oporto bowl macros look reasonable but protein for Pulled Chicken Bowl (36g) may be optimistic
- Grill'd extras (Bacon at 80 cal, 6g fat) looks low — typical bacon rasher is 100–120 cal

## Definition of done
- [ ] All base macro values cross-checked against official source
- [ ] Customization deltas verified where data is available
- [ ] Validation tests written (target: 25+ tests per restaurant)
- [ ] `lastUpdated` set to verification date in `restaurants.ts`
- [ ] `npm test` passes with all new tests
