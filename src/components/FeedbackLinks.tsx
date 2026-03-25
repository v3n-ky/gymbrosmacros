'use client';

import { useState } from 'react';

type FeedbackType = 'outdated-data' | 'restaurant-request';

interface FeedbackModalProps {
  open: boolean;
  type: FeedbackType;
  restaurant?: string;
  onClose: () => void;
}

function FeedbackModal({ open, type, restaurant, onClose }: FeedbackModalProps) {
  const [details, setDetails] = useState('');
  const [itemName, setItemName] = useState('');
  const [restaurantName, setRestaurantName] = useState(restaurant || '');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  if (!open) return null;

  const isOutdated = type === 'outdated-data';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setStatus('sending');

    const formName = isOutdated ? 'outdated-data' : 'restaurant-request';
    // 'bot-field' is the honeypot — always empty for real users; Netlify rejects if non-empty
    const fields: Record<string, string> = { 'form-name': formName, 'bot-field': '', details };
    if (isOutdated && restaurantName) fields['restaurant'] = restaurantName;
    if (isOutdated && itemName) fields['item-name'] = itemName;
    if (email) fields['email'] = email;

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(fields).toString(),
      });

      if (res.ok) {
        setStatus('sent');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setDetails('');
          setItemName('');
          setRestaurantName(restaurant || '');
          setEmail('');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-bold mb-1">
          {isOutdated ? 'Report Outdated Info' : 'Suggest a Restaurant'}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {isOutdated
            ? 'Let us know what needs updating and we\'ll fix it.'
            : 'Which restaurant would you like to see on EatMacros?'}
        </p>

        {status === 'sent' ? (
          <div className="text-center py-8">
            <svg className="h-12 w-12 text-primary mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium">Thanks for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Honeypot — hidden from humans, bots fill it, Netlify rejects those submissions */}
            <p aria-hidden="true" className="hidden">
              <label>
                Don&apos;t fill this out if you&apos;re human:
                <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>
            {isOutdated && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Restaurant
                  </label>
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Subway"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Item name (optional)
                  </label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Chicken Teriyaki 6-inch"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {isOutdated ? 'What\'s wrong?' : 'Restaurant name & why we should add it'}
                <span className="text-primary ml-0.5">*</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                rows={3}
                placeholder={
                  isOutdated
                    ? 'e.g. The protein for this item should be 35g not 28g...'
                    : 'e.g. Boost Juice — heaps of gym-goers get smoothies after a session'
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Email (optional — if you want a reply)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            {status === 'error' && (
              <p className="text-xs text-red-400">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || !details.trim()}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function ReportOutdatedButton({ restaurant }: { restaurant?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Report Outdated Info
      </button>
      <FeedbackModal
        open={open}
        type="outdated-data"
        restaurant={restaurant}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function SuggestRestaurantButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Suggest a Restaurant
      </button>
      <FeedbackModal
        open={open}
        type="restaurant-request"
        onClose={() => setOpen(false)}
      />
    </>
  );
}
