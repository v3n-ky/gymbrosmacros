'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MacroTargets } from '@/types/meal';

interface MacroInputProps {
  targets: MacroTargets;
  onChange: (targets: MacroTargets) => void;
}

const fields: { key: keyof MacroTargets; label: string; placeholder: string; color: string }[] = [
  { key: 'protein', label: 'Protein (g)', placeholder: 'e.g. 40', color: 'text-blue-400' },
  { key: 'calories', label: 'Max Calories', placeholder: 'e.g. 600', color: 'text-primary' },
  { key: 'carbs', label: 'Carbs (g)', placeholder: 'e.g. 50', color: 'text-amber-400' },
  { key: 'fat', label: 'Max Fat (g)', placeholder: 'e.g. 20', color: 'text-orange-400' },
];

export function MacroInput({ targets, onChange }: MacroInputProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {fields.map(({ key, label, placeholder, color }) => (
        <div key={key}>
          <Label htmlFor={key} className={`text-xs font-medium ${color}`}>
            {label}
          </Label>
          <Input
            id={key}
            type="number"
            placeholder={placeholder}
            value={targets[key] ?? ''}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : Number(e.target.value);
              onChange({ ...targets, [key]: value });
            }}
            className="mt-1"
          />
        </div>
      ))}
    </div>
  );
}
