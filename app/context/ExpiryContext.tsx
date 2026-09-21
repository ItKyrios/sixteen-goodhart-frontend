import type { ExpiryItem } from '~/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

type ExpiryContextValue = {
  expiries: ExpiryItem[];
  setExpiries: (items: ExpiryItem[]) => void;
  updateLocalExpiry: (updated: ExpiryItem) => void;
};

const ExpiryContext = createContext<ExpiryContextValue | null>(null);

export function ExpiryProvider({ children }: { children: ReactNode }) {
  const [expiries, setExpiries] = useState<ExpiryItem[]>([]);

  const updateLocalExpiry = (updatedItem: ExpiryItem) => {
    setExpiries((prev) =>
      prev.map((item) =>
        item.documentId === updatedItem.documentId ? updatedItem : item,
      ),
    );
  };

  return (
    <ExpiryContext.Provider
      value={{ expiries, setExpiries, updateLocalExpiry }}
    >
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
