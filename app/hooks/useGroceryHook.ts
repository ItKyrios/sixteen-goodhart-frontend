import type { GroceryItem } from '~/types';
import { useEffect, useState } from 'react';
import data from '~/data/grocery.json';

const useGrocery = () => {
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
  return { items, updateGrocery };
};

export default useGrocery;
