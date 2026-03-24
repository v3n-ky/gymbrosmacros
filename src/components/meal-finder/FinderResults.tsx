'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FinderResult, FinderVariant, variantTabLabel, buildOrderLabel } from '@/lib/meal-finder';
import { isTopPick, proteinPerCalorie } from '@/lib/macros';
import { MenuItem } from '@/types/menu';
import { ItemCustomizer } from '@/components/meal-builder/ItemCustomizer';
import { useProfiles } from '@/hooks/useProfiles';

const PAGE_SIZE = 9;

interface FinderResultsProps {
  results: FinderResult[];
  onAddItem?: (item: MenuItem, selectedOptions: Record<string, string[]>) => void;
}

interface ResultCardProps {
  result: FinderResult;
  onAddItem?: (item: MenuItem, selectedOptions: Record<string, string[]>) => void;
}

function scoreBadgeClass(score: number): string {
  if (score >= 80) return 'bg-primary/20 text-primary border-0';
  if (score >= 60) return 'bg-amber-500/20 text-amber-400 border-0';
  return 'bg-secondary text-muted-foreground border-0';
}

function ResultCard({ result, onAddItem }: ResultCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useProfiles();

  const activeVariant: FinderVariant = result.variants[activeIdx] ?? result.bestVariant;
  const macros = activeVariant.computedMacros;
  const topPick = isTopPick(macros);
  const hasVariants = result.variants.length > 1;
  const orderLabel = buildOrderLabel(result.item, activeVariant.selectedOptions);
  const favorited = isFavorite(result.item.id, activeVariant.selectedOptions);

  const handleToggleFavorite = () => {
    toggleFavorite({
      itemId: result.item.id,
      restaurantSlug: result.item.restaurantSlug,
      selectedOptions: activeVariant.selectedOptions,
      savedAt: Date.now(),
    });
  };

  return (
    <Card className="hover:border-primary/50 transition-all flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/${result.item.restaurantSlug}`}
              className="text-xs text-muted-foreground hover:text-primary uppercase tracking-wide"
            >
              {result.item.restaurantSlug}
            </Link>
            <h4 className="text-sm font-semibold leading-tight truncate">{result.item.name}</h4>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <button
              onClick={handleToggleFavorite}
              className="text-base leading-none transition-colors hover:scale-110"
              aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
            >
              {favorited ? (
                <span className="text-primary">♥</span>
              ) : (
                <span className="text-muted-foreground hover:text-primary">♡</span>
              )}
            </button>
            <Badge className={`text-xs ${scoreBadgeClass(activeVariant.matchScore)}`}>
              {activeVariant.matchScore}%
            </Badge>
            {topPick && (
              <Badge className="bg-primary/20 text-primary text-[10px] border-0">★</Badge>
            )}
          </div>
        </div>

        {/* Variant tabs */}
        {hasVariants && (
          <div className="flex gap-1 flex-wrap mb-3">
            {result.variants.map((v, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors leading-5 ${
                  i === activeIdx
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {variantTabLabel(result.item, v.selectedOptions)}
              </button>
            ))}
          </div>
        )}

        {/* How to order */}
        {orderLabel && (
          <p className="text-xs text-muted-foreground mb-3 leading-snug line-clamp-2">
            {orderLabel}
          </p>
        )}

        {/* Macros */}
        <div className="grid grid-cols-4 gap-1 text-center mt-auto">
          <div>
            <p className="text-[10px] text-muted-foreground">Cal</p>
            <p className="text-sm font-bold text-primary">{macros.calories}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Protein</p>
            <p className="text-sm font-bold text-blue-400">{macros.protein}g</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Carbs</p>
            <p className="text-sm font-bold text-amber-400">{macros.carbs}g</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Fat</p>
            <p className="text-sm font-bold text-orange-400">{macros.fat}g</p>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <span className="text-[10px] text-muted-foreground">
            {proteinPerCalorie(macros)}g / 100cal
          </span>
          {onAddItem && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 px-3 border-primary/40 text-primary hover:bg-primary/10"
              onClick={() => setCustomizerOpen(true)}
            >
              Customize &amp; Add
            </Button>
          )}
        </div>
      </CardContent>

      {/* Inline customizer */}
      {onAddItem && (
        <ItemCustomizer
          item={result.item}
          open={customizerOpen}
          onClose={() => setCustomizerOpen(false)}
          onAdd={onAddItem}
          submitLabel="Add to Meal"
          initialOptions={activeVariant.selectedOptions}
        />
      )}
    </Card>
  );
}

export function FinderResults({ results, onAddItem }: FinderResultsProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (results.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Enter your target macros above to find matching items.
      </p>
    );
  }

  const visible = results.slice(0, visibleCount);
  const hasMore = visibleCount < results.length;

  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Top {results.length} matches
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((result) => (
          <ResultCard key={result.item.id} result={result} onAddItem={onAddItem} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="border-primary/40 text-primary hover:bg-primary/10"
          >
            Show more ({results.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
