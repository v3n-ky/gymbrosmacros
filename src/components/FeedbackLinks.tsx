const REPO = 'v3n-ky/gymbrosmacros';

function issueUrl(title: string, body: string, label?: string): string {
  const params = new URLSearchParams({ title, body });
  if (label) params.set('labels', label);
  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}

export function ReportOutdatedButton({ restaurant }: { restaurant?: string }) {
  const title = restaurant
    ? `[Outdated Data] ${restaurant}`
    : '[Outdated Data] ';
  const body = restaurant
    ? `**Restaurant:** ${restaurant}\n**Item name:**\n**What's wrong:**\n**Source (if known):**`
    : '**Restaurant:**\n**Item name:**\n**What\'s wrong:**\n**Source (if known):**';

  return (
    <a
      href={issueUrl(title, body, 'outdated-data')}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Report Outdated Info
    </a>
  );
}

export function SuggestRestaurantButton() {
  const title = '[Restaurant Request] ';
  const body =
    '**Restaurant name:**\n**Website / menu link:**\n**Why should we add it?**';

  return (
    <a
      href={issueUrl(title, body, 'restaurant-request')}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Suggest a Restaurant
    </a>
  );
}
