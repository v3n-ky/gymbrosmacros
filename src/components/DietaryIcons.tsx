'use client';

/** Standardised dietary tags used across all menu data */
export const DIETARY_TAGS = [
  'vegan',
  'vegetarian',
  'gluten-free-option',
  'contains-nuts',
  'contains-fish',
  'contains-meat',
  'chicken',
  'beef',
  'pork',
] as const;

export type DietaryTag = (typeof DIETARY_TAGS)[number];

/** Tags shown as user-facing filter chips (dietary preference / allergen filters) */
export const FILTER_TAGS: { tag: string; label: string; icon: string; color: string }[] = [
  { tag: 'vegan', label: 'Vegan', icon: '🌱', color: 'text-green-400' },
  { tag: 'vegetarian', label: 'Vegetarian', icon: '🥦', color: 'text-green-500' },
  { tag: 'gluten-free-option', label: 'Gluten Free', icon: '🌾', color: 'text-amber-300' },
  { tag: 'contains-fish', label: 'Fish/Seafood', icon: '🐟', color: 'text-cyan-400' },
  { tag: 'contains-meat', label: 'Meat', icon: '🥩', color: 'text-red-400' },
];

const iconMap: Record<string, { emoji: string; title: string; color: string }> = {
  vegan: { emoji: '🌱', title: 'Vegan', color: 'text-green-400' },
  vegetarian: { emoji: '🥦', title: 'Vegetarian', color: 'text-green-500' },
  'gluten-free-option': { emoji: '🌾', title: 'Gluten Free Option', color: 'text-amber-300' },
  'contains-nuts': { emoji: '🥜', title: 'Contains Nuts', color: 'text-yellow-600' },
  'contains-fish': { emoji: '🐟', title: 'Fish / Seafood', color: 'text-cyan-400' },
  'contains-meat': { emoji: '🥩', title: 'Contains Meat', color: 'text-red-400' },
  chicken: { emoji: '🍗', title: 'Chicken', color: 'text-orange-300' },
  beef: { emoji: '🥩', title: 'Beef', color: 'text-red-400' },
  pork: { emoji: '🐷', title: 'Pork', color: 'text-pink-400' },
};

// Tags that are shown as icons on item cards (skip generic 'contains-meat' if specific type exists)
const DISPLAY_ICON_TAGS = ['vegan', 'vegetarian', 'gluten-free-option', 'contains-nuts', 'contains-fish'];
const PROTEIN_TYPE_TAGS = ['chicken', 'beef', 'pork'];

interface DietaryIconProps {
  tag: string;
  showLabel?: boolean;
}

export function DietaryIcon({ tag, showLabel }: DietaryIconProps) {
  const info = iconMap[tag];
  if (!info) return null;

  return (
    <span className={`inline-flex items-center gap-0.5 ${info.color}`} title={info.title}>
      <span className="text-sm leading-none">{info.emoji}</span>
      {showLabel && <span className="text-xs">{info.title}</span>}
    </span>
  );
}

/** Renders a compact row of dietary icons for a list of tags */
export function DietaryIcons({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;

  // Collect display icons: dietary preference icons first, then protein type (only one)
  const displayTags: string[] = [];

  for (const tag of DISPLAY_ICON_TAGS) {
    if (tags.includes(tag)) displayTags.push(tag);
  }

  // Show one protein-type icon (most specific)
  const proteinTag = PROTEIN_TYPE_TAGS.find((t) => tags.includes(t));
  if (proteinTag && displayTags.length === 0) {
    // Only show protein icon if no dietary preference tags (avoids duplication with contains-meat)
    displayTags.push(proteinTag);
  }

  if (displayTags.length === 0) return null;

  return (
    <span className="inline-flex items-center gap-1">
      {displayTags.map((tag) => (
        <DietaryIcon key={tag} tag={tag} />
      ))}
    </span>
  );
}

/** Reusable filter toggle buttons for dietary tags */
export function DietaryFilters({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (tags: string[]) => void;
}) {
  const toggle = (tag: string) => {
    onChange(
      selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_TAGS.map(({ tag, label, icon, color }) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-secondary text-muted-foreground border border-transparent hover:border-border'
            }`}
          >
            <span className={active ? '' : color}>{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
