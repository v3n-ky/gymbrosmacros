import Link from 'next/link';
import { RestaurantGrid } from '@/components/restaurant/RestaurantGrid';
import { getAllMenuItems } from '@/data';
import { proteinPerCalorie } from '@/lib/macros';

export default function HomePage() {
  const allItems = getAllMenuItems();
  const topProtein = [...allItems]
    .sort((a, b) => b.baseMacros.protein - a.baseMacros.protein)
    .slice(0, 3);
  const topEfficiency = [...allItems]
    .sort(
      (a, b) =>
        proteinPerCalorie(b.baseMacros) - proteinPerCalorie(a.baseMacros)
    )
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-primary">Macro Calculator</span>{' '}
          <span className="text-foreground">for Aussie Fast Food</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your macros at Subway, GYG, Fishbowl, Grill&apos;d, Oporto,
          Nando&apos;s and more. Built for gym bros who eat out.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link
            href="/find"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Find a Meal by Macros
          </Link>
          <Link
            href="/rankings"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            View Rankings
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Highest Protein Items
          </h2>
          <div className="space-y-3">
            {topProtein.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.restaurantSlug.toUpperCase()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">
                  {item.baseMacros.protein}g
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Best Protein Efficiency (g/100cal)
          </h2>
          <div className="space-y-3">
            {topEfficiency.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.restaurantSlug.toUpperCase()}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">
                  {proteinPerCalorie(item.baseMacros)}g/100cal
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Choose a Restaurant</h2>
        <RestaurantGrid />
      </section>
    </div>
  );
}
