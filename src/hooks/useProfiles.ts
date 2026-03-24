'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile, ProfileId, SavedItem, SavedMeal } from '@/types/profile';

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

/** Ensure a value from localStorage is a valid profile record, filling gaps with defaults. */
function sanitiseProfiles(raw: unknown): Record<ProfileId, UserProfile> {
  const base = (raw && typeof raw === 'object' && !Array.isArray(raw))
    ? (raw as Record<string, unknown>)
    : {};

  return {
    A: { ...makeDefault('A', 'Cutting'), ...(typeof base.A === 'object' && base.A ? base.A as Partial<UserProfile> : {}) },
    B: { ...makeDefault('B', 'Bulking'), ...(typeof base.B === 'object' && base.B ? base.B as Partial<UserProfile> : {}) },
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
