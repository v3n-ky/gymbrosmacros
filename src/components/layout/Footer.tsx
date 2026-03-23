import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-primary">GymBrosMacros</span>
              {' '}— Australian fast food macro calculator
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Not affiliated with or endorsed by any listed restaurant. Nutritional values are approximate.
            </p>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/find" className="hover:text-primary transition-colors">
              Find a Meal
            </Link>
            <Link href="/rankings" className="hover:text-primary transition-colors">
              Rankings
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
