import type { ExpiryItem } from '~/types';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import data from '~/data/expiry.json';

type ExpiryContextValue = {
  items: ExpiryItem[];
  updateExpiry: (updated: ExpiryItem[]) => void;
};

const ExpiryContext = createContext<ExpiryContextValue | undefined>(undefined);

export function ExpiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ExpiryItem[]>([]);

  // Load from localStorage AFTER hydration
  useEffect(() => {
    const saved = window.localStorage.getItem('expiry');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(data);
    }
  }, []);

  const updateExpiry = (updated: ExpiryItem[]) => {
    setItems(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('expiry', JSON.stringify(updated));
    }
  };
  return (
    <ExpiryContext.Provider value={{ items, updateExpiry }}>
      {children}
    </ExpiryContext.Provider>
  );
}

export default function useExpiry() {
  const ctx = useContext(ExpiryContext);
  if (!ctx) {
    throw new Error('useExpiry must be used within a ExpiryProvider');
  }
  return ctx;
}
