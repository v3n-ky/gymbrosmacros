'use client';

import { useProfiles } from '@/hooks/useProfiles';
import { ProfileId } from '@/types/profile';

export function ProfileSwitcher() {
  const { activeId, setActiveId, profiles } = useProfiles();

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground hidden lg:inline">Mode:</span>
      <div className="flex items-center gap-0.5 bg-secondary rounded-lg p-0.5">
      {(['A', 'B'] as ProfileId[]).map((id) => (
        <button
          key={id}
          onClick={() => setActiveId(id)}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            activeId === id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {profiles[id]?.label ?? id}
        </button>
      ))}
      </div>
    </div>
  );
}
