import type { GroceryItem } from '~/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

type GroceryContextValue = {
  groceries: GroceryItem[];
  setGroceries: (items: GroceryItem[]) => void;
  updateLocalGrocery: (item: GroceryItem) => void;
};

const GroceryContext = createContext<GroceryContextValue | null>(null);

export function GroceryProvider({ children }: { children: ReactNode }) {
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);

  const updateLocalGrocery = (updatedItem: GroceryItem) => {
    setGroceries((prev) =>
      prev.map((item) =>
        item.documentId === updatedItem.documentId ? updatedItem : item,
      ),
    );
  };

  return (
    <GroceryContext.Provider
      value={{ groceries, setGroceries, updateLocalGrocery }}
    >
      {children}
    </GroceryContext.Provider>
  );
}

export default function useGrocery() {
  const ctx = useContext(GroceryContext);
  if (!ctx) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return ctx;
}
