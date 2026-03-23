'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/types/menu';
import { isHighProtein, isGymBroApproved, proteinPerCalorie } from '@/lib/macros';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const highProtein = isHighProtein(item.baseMacros);
  const gymBroApproved = isGymBroApproved(item.baseMacros);

  return (
    <Card
      className="group cursor-pointer hover:border-primary/50 transition-all duration-200"
      onClick={() => onSelect(item)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold group-hover:text-primary transition-colors">
            {item.name}
          </h4>
          <div className="flex gap-1 shrink-0 ml-2">
            {gymBroApproved && (
              <Badge className="bg-primary/20 text-primary text-[10px] px-1.5">
                GBA
              </Badge>
            )}
            {highProtein && !gymBroApproved && (
              <Badge variant="secondary" className="text-[10px] px-1.5">
                High Protein
              </Badge>
            )}
          </div>
        </div>

        {item.servingSize && (
          <p className="text-xs text-muted-foreground mb-3">{item.servingSize}</p>
        )}

        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Cal</p>
            <p className="text-sm font-bold text-primary">{item.baseMacros.calories}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Protein</p>
            <p className="text-sm font-bold text-blue-400">{item.baseMacros.protein}g</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Carbs</p>
            <p className="text-sm font-bold text-amber-400">{item.baseMacros.carbs}g</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Fat</p>
            <p className="text-sm font-bold text-orange-400">{item.baseMacros.fat}g</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{proteinPerCalorie(item.baseMacros)}g protein/100cal</span>
          {item.customizationGroups && item.customizationGroups.length > 0 && (
            <span className="text-primary">Customise</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
