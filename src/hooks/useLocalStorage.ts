'use client';

import { useState, useEffect } from 'react';

const SYNC_EVENT = 'localstorage-sync';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // use initial value
    }
  }, [key]);

  // Listen for writes from other hook instances in the same tab
  useEffect(() => {
    const handleSync = (e: Event) => {
      const { key: updatedKey, value } = (e as CustomEvent<{ key: string; value: T }>).detail;
      if (updatedKey === key) {
        setStoredValue(value);
      }
    };
    window.addEventListener(SYNC_EVENT, handleSync);
    return () => window.removeEventListener(SYNC_EVENT, handleSync);
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        // storage full or unavailable
      }
      return valueToStore;
    });

    // Dispatch sync event outside the state updater so it fires exactly once,
    // even in React Strict Mode where the updater runs twice.
    Promise.resolve().then(() => {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw !== null) {
          window.dispatchEvent(
            new CustomEvent(SYNC_EVENT, { detail: { key, value: JSON.parse(raw) } })
          );
        }
      } catch {
        // ignore
      }
    });
  };

  return [storedValue, setValue];
}
