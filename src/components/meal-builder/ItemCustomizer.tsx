'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/types/menu';
import { computeItemMacros, isHighProtein, isTopPick } from '@/lib/macros';
import { MacroSummary } from './MacroSummary';

interface ItemCustomizerProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem, selectedOptions: Record<string, string[]>) => void;
}

export function ItemCustomizer({ item, open, onClose, onAdd }: ItemCustomizerProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  // Reset selections when item changes
  useMemo(() => {
    if (!item) return;
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
  }, [item]);

  if (!item) return null;

  const computedMacros = computeItemMacros(item, selectedOptions);
  const highProtein = isHighProtein(computedMacros);
  const topPick = isTopPick(computedMacros);

  const handleOptionToggle = (groupId: string, optionId: string, type: 'single' | 'multi', maxSelections?: number) => {
    setSelectedOptions((prev) => {
      const current = prev[groupId] ?? [];
      if (type === 'single') {
        return { ...prev, [groupId]: [optionId] };
      }
      // Multi-select
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

        <Button
          className="w-full mt-2"
          onClick={() => {
            onAdd(item, selectedOptions);
            onClose();
          }}
        >
          Add to Meal
        </Button>
      </DialogContent>
    </Dialog>
  );
}
