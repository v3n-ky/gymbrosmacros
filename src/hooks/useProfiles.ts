'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile, ProfileId, SavedItem } from '@/types/profile';

const makeDefault = (id: ProfileId, label: string): UserProfile => ({
  id,
  label,
  macroTargets: {},
  dietaryFilters: [],
  restaurantFilters: [],
  favorites: [],
});

const DEFAULT_PROFILES: Record<ProfileId, UserProfile> = {
  A: makeDefault('A', 'Cutting'),
  B: makeDefault('B', 'Bulking'),
};

export function useProfiles() {
  const [profiles, setProfiles] = useLocalStorage<Record<ProfileId, UserProfile>>(
    'gmb-profiles',
    DEFAULT_PROFILES
  );
  const [activeId, setActiveId] = useLocalStorage<ProfileId>('gmb-active-profile', 'A');

  const activeProfile = profiles[activeId];

  const updateProfile = useCallback(
    (id: ProfileId, updates: Partial<UserProfile>) => {
      setProfiles((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...updates },
      }));
    },
    [setProfiles]
  );

  const toggleFavorite = useCallback(
    (item: SavedItem) => {
      setProfiles((prev) => {
        const profile = prev[activeId];
        const key = item.itemId + JSON.stringify(item.selectedOptions);
        const exists = profile.favorites.some(
          (f) => f.itemId + JSON.stringify(f.selectedOptions) === key
        );
        const favorites = exists
          ? profile.favorites.filter(
              (f) => f.itemId + JSON.stringify(f.selectedOptions) !== key
            )
          : [...profile.favorites, item];
        return { ...prev, [activeId]: { ...profile, favorites } };
      });
    },
    [setProfiles, activeId]
  );

  const isFavorite = useCallback(
    (itemId: string, selectedOptions: Record<string, string[]>) => {
      const key = itemId + JSON.stringify(selectedOptions);
      return activeProfile.favorites.some(
        (f) => f.itemId + JSON.stringify(f.selectedOptions) === key
      );
    },
    [activeProfile]
  );

  return {
    profiles,
    activeId,
    activeProfile,
    setActiveId,
    updateProfile,
    toggleFavorite,
    isFavorite,
  };
}
