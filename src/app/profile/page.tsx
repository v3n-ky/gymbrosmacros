'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useProfiles } from '@/hooks/useProfiles';
import { ProfileId } from '@/types/profile';
import { MacroTargets } from '@/types/meal';

function ProfileForm({ profileId }: { profileId: ProfileId }) {
  const { profiles, updateProfile } = useProfiles();
  const profile = profiles[profileId];

  const [label, setLabel] = useState(profile?.label ?? '');
  const [targets, setTargets] = useState<MacroTargets>(profile?.macroTargets ?? {});
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile(profileId, { label: label.trim() || profileId, macroTargets: targets });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setTarget = (key: keyof MacroTargets, val: string) => {
    const num = parseInt(val, 10);
    setTargets((prev) => ({ ...prev, [key]: isNaN(num) || val === '' ? undefined : num }));
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor={`label-${profileId}`} className="text-sm">Profile name</Label>
          <Input
            id={`label-${profileId}`}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={profileId === 'A' ? 'e.g. Cutting' : 'e.g. Bulking'}
            className="max-w-xs"
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-3">Daily macro targets</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              { key: 'calories', label: 'Calories', unit: 'kcal', placeholder: 'e.g. 2000' },
              { key: 'protein',  label: 'Protein',  unit: 'g',    placeholder: 'e.g. 160' },
              { key: 'carbs',    label: 'Carbs',    unit: 'g',    placeholder: 'e.g. 200' },
              { key: 'fat',      label: 'Fat',      unit: 'g',    placeholder: 'e.g. 70' },
            ] as const).map(({ key, label: lbl, unit, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={`${profileId}-${key}`} className="text-xs text-muted-foreground">
                  {lbl} ({unit})
                </Label>
                <Input
                  id={`${profileId}-${key}`}
                  type="number"
                  min={0}
                  value={targets[key] ?? ''}
                  onChange={(e) => setTarget(key, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSave} className="w-full sm:w-auto">
          {saved ? 'Saved!' : 'Save profile'}
        </Button>
      </CardContent>
    </Card>
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
        Configure your cutting and bulking profiles. Targets are used to pre-fill the meal finder.
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
