import type { GroceryItem } from '~/types';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import data from '~/data/grocery.json';

type GroceryContextValue = {
  items: GroceryItem[];
  updateGrocery: (updated: GroceryItem[]) => void;
};

const GroceryContext = createContext<GroceryContextValue | undefined>(
  undefined,
);

export function GroceryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GroceryItem[]>([]);

  // Load from localStorage AFTER hydration
  useEffect(() => {
    const saved = window.localStorage.getItem('grocery');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(data);
    }
  }, []);

  const updateGrocery = (updated: GroceryItem[]) => {
    setItems(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('grocery', JSON.stringify(updated));
    }
  };
  return (
    <GroceryContext.Provider value={{ items, updateGrocery }}>
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
