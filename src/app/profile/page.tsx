'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useProfiles } from '@/hooks/useProfiles';
import { ProfileId, MealType } from '@/types/profile';
import { MacroTargets } from '@/types/meal';

const MEAL_TYPES: { id: MealType; label: string; emoji: string; hint: string }[] = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅', hint: 'e.g. 400 kcal, 30g protein' },
  { id: 'lunch',     label: 'Lunch',     emoji: '☀️', hint: 'e.g. 600 kcal, 45g protein' },
  { id: 'dinner',    label: 'Dinner',    emoji: '🌙', hint: 'e.g. 700 kcal, 50g protein' },
];

function MealTargetForm({ profileId, mealType }: { profileId: ProfileId; mealType: MealType }) {
  const { profiles, updateProfile } = useProfiles();
  const profile = profiles[profileId];
  // Always reactive — reads from localStorage once it loads
  const persisted = profile?.mealTargets?.[mealType] ?? {};

  // Track unsaved edits separately. null = "use persisted value" (no edits yet).
  const [pending, setPending] = useState<MacroTargets | null>(null);
  const [saved, setSaved] = useState(false);

  // Displayed value: local edits while typing, persisted once saved / on initial load
  const targets = pending ?? persisted;

  const setField = (key: keyof MacroTargets, val: string) => {
    const num = parseInt(val, 10);
    setPending((prev) => ({
      ...(prev ?? persisted),
      [key]: isNaN(num) || val === '' ? undefined : num,
    }));
  };

  const handleSave = () => {
    updateProfile(profileId, {
      mealTargets: { ...profile.mealTargets, [mealType]: targets },
    });
    setPending(null); // persisted will update reactively; local edits cleared
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const meal = MEAL_TYPES.find((m) => m.id === mealType)!;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground">{meal.hint}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([
            { key: 'calories', label: 'Calories', unit: 'kcal', placeholder: 'e.g. 600' },
            { key: 'protein',  label: 'Protein',  unit: 'g',    placeholder: 'e.g. 45' },
            { key: 'carbs',    label: 'Carbs',    unit: 'g',    placeholder: 'e.g. 60' },
            { key: 'fat',      label: 'Fat',      unit: 'g',    placeholder: 'e.g. 20' },
          ] as const).map(({ key, label, unit, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`${profileId}-${mealType}-${key}`} className="text-xs text-muted-foreground">
                {label} ({unit})
              </Label>
              <Input
                id={`${profileId}-${mealType}-${key}`}
                type="number"
                min={0}
                value={targets[key] ?? ''}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          {saved ? 'Saved!' : 'Save targets'}
        </Button>
      </CardContent>
    </Card>
  );
}

function ProfileForm({ profileId }: { profileId: ProfileId }) {
  const { profiles, updateProfile } = useProfiles();
  const profile = profiles[profileId];

  const [label, setLabel] = useState(profile?.label ?? '');
  const [labelSaved, setLabelSaved] = useState(false);
  const [activeMeal, setActiveMeal] = useState<MealType>('lunch');

  // Sync label state when profile loads from localStorage (same fix as MealTargetForm)
  useEffect(() => {
    setLabel(profile?.label ?? '');
  }, [profile?.label]);

  const handleSaveLabel = () => {
    updateProfile(profileId, { label: label.trim() || profileId });
    setLabelSaved(true);
    setTimeout(() => setLabelSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Profile name */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-end gap-3">
            <div className="space-y-1.5 flex-1 max-w-xs">
              <Label htmlFor={`label-${profileId}`} className="text-sm">Profile name</Label>
              <Input
                id={`label-${profileId}`}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder={profileId === 'A' ? 'e.g. Cutting' : 'e.g. Bulking'}
              />
            </div>
            <Button variant="outline" onClick={handleSaveLabel} className="mb-0.5">
              {labelSaved ? 'Saved!' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meal targets */}
      <div>
        <p className="text-sm font-medium mb-3">Macro targets per meal</p>
        <div className="flex gap-2 mb-4">
          {MEAL_TYPES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMeal(m.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeMeal === m.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
        <MealTargetForm key={`${profileId}-${activeMeal}`} profileId={profileId} mealType={activeMeal} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { activeId, setActiveId, profiles } = useProfiles();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        <span className="text-primary">Profile</span> Settings
      </h1>
      <p className="text-muted-foreground mb-6">
        Set macro targets for each meal. These pre-fill Find a Meal when you pick a meal type.
      </p>

      {/* Profile tabs */}
      <div className="flex gap-2 mb-6">
        {(['A', 'B'] as ProfileId[]).map((id) => (
          <button
            key={id}
            onClick={() => setActiveId(id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeId === id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {profiles[id]?.label ?? id}
          </button>
        ))}
      </div>

      <ProfileForm key={activeId} profileId={activeId} />

      <p className="text-xs text-muted-foreground mt-6">
        Profiles are stored locally on this device. Clearing browser data will reset them.
      </p>
    </div>
  );
}
