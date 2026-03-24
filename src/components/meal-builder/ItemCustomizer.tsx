'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/types/menu';
import { computeItemMacros, isHighProtein, isTopPick } from '@/lib/macros';
import { MacroSummary } from './MacroSummary';
import { useProfiles } from '@/hooks/useProfiles';

interface ItemCustomizerProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem, selectedOptions: Record<string, string[]>) => void;
  submitLabel?: string;
  initialOptions?: Record<string, string[]>;
}

export function ItemCustomizer({ item, open, onClose, onAdd, submitLabel = 'Add to Meal', initialOptions }: ItemCustomizerProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const { toggleFavorite, isFavorite } = useProfiles();

  useEffect(() => {
    if (!item) return;
    if (initialOptions && Object.keys(initialOptions).length > 0) {
      setSelectedOptions(initialOptions);
      return;
    }
    const defaults: Record<string, string[]> = {};
    for (const group of item.customizationGroups ?? []) {
      if (group.defaultOptionId) {
        defaults[group.id] = [group.defaultOptionId];
      } else if (group.type === 'single' && group.options.length > 0) {
        const defaultOpt = group.options.find((o) => o.isDefault);
        if (defaultOpt) defaults[group.id] = [defaultOpt.id];
      }
    }
    setSelectedOptions(defaults);
  }, [item, initialOptions]);

  if (!item) return null;

  const computedMacros = computeItemMacros(item, selectedOptions);
  const highProtein = isHighProtein(computedMacros);
  const topPick = isTopPick(computedMacros);
  const favorited = isFavorite(item.id, selectedOptions);

  const handleToggleFavorite = () => {
    toggleFavorite({
      itemId: item.id,
      restaurantSlug: item.restaurantSlug,
      selectedOptions,
      savedAt: Date.now(),
    });
  };

  const handleOptionToggle = (groupId: string, optionId: string, type: 'single' | 'multi', maxSelections?: number) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] ?? [];
      if (type === 'single') {
        return { ...prev, [groupId]: [optionId] };
      }
      if (current.includes(optionId)) {
        return { ...prev, [groupId]: current.filter((id) => id !== optionId) };
      }
      if (maxSelections && current.length >= maxSelections) {
        return prev;
      }
      return { ...prev, [groupId]: [...current, optionId] };
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {item.name}
            {topPick && (
              <Badge className="bg-primary/20 text-primary text-xs">Top Pick</Badge>
            )}
            {highProtein && !topPick && (
              <Badge variant="secondary" className="text-xs">High Protein</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Live macro preview */}
        <div className="rounded-lg bg-secondary/50 p-4 mb-4">
          <MacroSummary macros={computedMacros} />
        </div>

        {/* Customization groups */}
        {item.customizationGroups?.map((group) => (
          <div key={group.id} className="mb-4">
            <h4 className="text-sm font-medium mb-2">
              {group.name}
              {group.type === 'multi' && group.maxSelections && (
                <span className="text-xs text-muted-foreground ml-2">
                  (max {group.maxSelections})
                </span>
              )}
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const isSelected = (selectedOptions[group.id] ?? []).includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionToggle(group.id, option.id, group.type, group.maxSelections)}
                    className={`rounded-lg border px-3 py-2 text-xs transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <span className="font-medium">{option.name}</span>
                    {option.macroDelta.calories != null && option.macroDelta.calories !== 0 && (
                      <span className="ml-1 opacity-70">
                        ({option.macroDelta.calories > 0 ? '+' : ''}{option.macroDelta.calories} cal)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 flex-shrink-0 text-base ${favorited ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}
            onClick={handleToggleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          >
            {favorited ? '♥' : '♡'}
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              onAdd(item, selectedOptions);
              onClose();
            }}
          >
            {submitLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
