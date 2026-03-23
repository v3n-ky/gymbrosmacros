'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FinderResult } from '@/lib/meal-finder';
import { isHighProtein, isTopPick, proteinPerCalorie } from '@/lib/macros';

interface FinderResultsProps {
  results: FinderResult[];
}

export function FinderResults({ results }: FinderResultsProps) {
  if (results.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Enter your target macros above to find matching items.
      </p>
    );
  }

  // Group by restaurant
  const grouped = results.reduce<Record<string, FinderResult[]>>((acc, result) => {
    const slug = result.item.restaurantSlug;
    if (!acc[slug]) acc[slug] = [];
    acc[slug].push(result);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top results across all restaurants */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Top {Math.min(results.length, 20)} matches
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((result) => (
            <Card key={result.item.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Link
                      href={`/${result.item.restaurantSlug}`}
                      className="text-xs text-muted-foreground hover:text-primary uppercase"
                    >
                      {result.item.restaurantSlug}
                    </Link>
                    <h4 className="text-sm font-semibold">{result.item.name}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={result.matchScore >= 80 ? 'default' : 'secondary'}
                      className={`text-xs ${
                        result.matchScore >= 80 ? 'bg-primary/20 text-primary' : ''
                      }`}
                    >
                      {result.matchScore}% match
                    </Badge>
                    {isTopPick(result.item.baseMacros) && (
                      <Badge className="bg-primary/20 text-primary text-[10px]">Top Pick</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Cal</p>
                    <p className="text-sm font-bold text-primary">
                      {result.item.baseMacros.calories}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="text-sm font-bold text-blue-400">
                      {result.item.baseMacros.protein}g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="text-sm font-bold text-amber-400">
                      {result.item.baseMacros.carbs}g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fat</p>
                    <p className="text-sm font-bold text-orange-400">
                      {result.item.baseMacros.fat}g
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-xs text-muted-foreground text-right">
                  {proteinPerCalorie(result.item.baseMacros)}g protein/100cal
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
