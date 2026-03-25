'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile, ProfileId, MealType, SavedItem, SavedMeal } from '@/types/profile';
import { MacroTargets } from '@/types/meal';

// ─── schema version ───────────────────────────────────────────────────────────
// Bump SCHEMA_VERSION whenever a field is renamed, removed, or its structure
// changes in a way that old data would produce the wrong runtime behaviour.
// Add a corresponding entry to MIGRATIONS below.
//
// History:
//   v1 (current) — mealTargets: Record<MealType, MacroTargets>, savedMeals added
//   v0            — macroTargets: MacroTargets (flat, per-profile), no savedMeals
export const SCHEMA_VERSION = 1;

const makeDefault = (id: ProfileId, label: string): UserProfile => ({
  id,
  label,
  mealTargets: { breakfast: {}, lunch: {}, dinner: {} },
  dietaryFilters: [],
  restaurantFilters: [],
  favorites: [],
  savedMeals: [],
});

const DEFAULT_PROFILES: Record<ProfileId, UserProfile> = {
  A: makeDefault('A', 'Cutting'),
  B: makeDefault('B', 'Bulking'),
};

/** Canonical, order-independent key for a saved item. */
function favoriteKey(itemId: string, selectedOptions: Record<string, string[]>): string {
  const sorted = Object.keys(selectedOptions)
    .sort()
    .map((k) => `${k}:${[...selectedOptions[k]].sort().join(',')}`)
    .join('|');
  return `${itemId}__${sorted}`;
}

// ─── deep sanitisers ──────────────────────────────────────────────────────────

function sanitiseDietaryFilters(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const tags = raw.filter((t): t is string => typeof t === 'string');
  const hasPlant = tags.some((t) => ['vegan', 'vegetarian'].includes(t));
  const hasAnimal = tags.some((t) => ['contains-meat', 'contains-fish'].includes(t));
  // Conflict: drop the animal side, keep plant-based + gluten-free
  if (hasPlant && hasAnimal) return tags.filter((t) => !['contains-meat', 'contains-fish'].includes(t));
  return tags;
}

function sanitiseMealTargets(raw: unknown): Record<MealType, MacroTargets> {
  const def: Record<MealType, MacroTargets> = { breakfast: {}, lunch: {}, dinner: {} };
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return def;
  const m = raw as Record<string, unknown>;
  const toTargets = (v: unknown): MacroTargets =>
    v && typeof v === 'object' && !Array.isArray(v) ? (v as MacroTargets) : {};
  return {
    breakfast: toTargets(m.breakfast),
    lunch: toTargets(m.lunch),
    dinner: toTargets(m.dinner),
  };
}

function sanitiseProfile(raw: unknown, id: ProfileId, label: string): UserProfile {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return makeDefault(id, label);
  const r = raw as Record<string, unknown>;

  // v0 → v1 migration: old data stored flat macroTargets instead of nested mealTargets.
  // Rescue the flat targets into lunch (most common meal) so the user doesn't lose their data.
  let mealTargets = sanitiseMealTargets(r.mealTargets);
  if (!r.mealTargets && r.macroTargets && typeof r.macroTargets === 'object') {
    mealTargets = { breakfast: {}, lunch: r.macroTargets as MacroTargets, dinner: {} };
  }

  return {
    id,
    label: typeof r.label === 'string' && r.label.trim() ? r.label : label,
    mealTargets,
    dietaryFilters: sanitiseDietaryFilters(r.dietaryFilters),
    restaurantFilters: Array.isArray(r.restaurantFilters) ? (r.restaurantFilters as string[]) : [],
    favorites: Array.isArray(r.favorites) ? (r.favorites as SavedItem[]) : [],
    savedMeals: Array.isArray(r.savedMeals) ? (r.savedMeals as SavedMeal[]) : [],
    ...(r.lastMealType === 'breakfast' || r.lastMealType === 'lunch' || r.lastMealType === 'dinner'
      ? { lastMealType: r.lastMealType }
      : {}),
  };
}

/** Deeply validate every field so any stale or corrupt localStorage shape is safe. */
function sanitiseProfiles(raw: unknown): Record<ProfileId, UserProfile> {
  const base = (raw && typeof raw === 'object' && !Array.isArray(raw))
    ? (raw as Record<string, unknown>)
    : {};

  return {
    A: sanitiseProfile(base.A, 'A', 'Cutting'),
    B: sanitiseProfile(base.B, 'B', 'Bulking'),
  };
}

export function useProfiles() {
  const [rawProfiles, setProfiles] = useLocalStorage<Record<ProfileId, UserProfile>>(
    'gmb-profiles',
    DEFAULT_PROFILES
  );
  const [rawActiveId, setActiveId] = useLocalStorage<ProfileId>('gmb-active-profile', 'A');

  // Harden: ensure profiles always has both keys, and activeId is valid
  const profiles = sanitiseProfiles(rawProfiles);
  const activeId: ProfileId = rawActiveId === 'A' || rawActiveId === 'B' ? rawActiveId : 'A';
  const activeProfile = profiles[activeId];

  const updateProfile = useCallback(
    (id: ProfileId, updates: Partial<UserProfile>) => {
      setProfiles((prev) => {
        const safe = sanitiseProfiles(prev);
        return { ...safe, [id]: { ...safe[id], ...updates } };
      });
    },
    [setProfiles]
  );

  const toggleFavorite = useCallback(
    (item: SavedItem) => {
      setProfiles((prev) => {
        const safe = sanitiseProfiles(prev);
        const profile = safe[activeId];
        const key = favoriteKey(item.itemId, item.selectedOptions);
        const exists = profile.favorites.some(
          (f) => favoriteKey(f.itemId, f.selectedOptions) === key
        );
        const favorites = exists
          ? profile.favorites.filter(
              (f) => favoriteKey(f.itemId, f.selectedOptions) !== key
            )
          : [...profile.favorites, item];
        return { ...safe, [activeId]: { ...profile, favorites } };
      });
    },
    [setProfiles, activeId]
  );

  const isFavorite = useCallback(
    (itemId: string, selectedOptions: Record<string, string[]>) => {
      const key = favoriteKey(itemId, selectedOptions);
      return (activeProfile.favorites ?? []).some(
        (f) => favoriteKey(f.itemId, f.selectedOptions) === key
      );
    },
    [activeProfile]
  );

  const saveMeal = useCallback(
    (meal: SavedMeal) => {
      setProfiles((prev) => {
        const safe = sanitiseProfiles(prev);
        const profile = safe[activeId];
        return {
          ...safe,
          [activeId]: {
            ...profile,
            savedMeals: [...(profile.savedMeals ?? []), meal],
          },
        };
      });
    },
    [setProfiles, activeId]
  );

  const removeSavedMeal = useCallback(
    (id: string) => {
      setProfiles((prev) => {
        const safe = sanitiseProfiles(prev);
        const profile = safe[activeId];
        return {
          ...safe,
          [activeId]: {
            ...profile,
            savedMeals: (profile.savedMeals ?? []).filter((m) => m.id !== id),
          },
        };
      });
    },
    [setProfiles, activeId]
  );

  return {
    profiles,
    activeId,
    activeProfile,
    setActiveId,
    updateProfile,
    toggleFavorite,
    isFavorite,
    saveMeal,
    removeSavedMeal,
  };
}
