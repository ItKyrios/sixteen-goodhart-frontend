import type { GroceryItem } from '~/types';
import { useState } from 'react';
import data from '~/data/grocery.json';

const useGrocery = () => {
  const saved =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('grocery')
      : null;
  const initial: GroceryItem[] = saved ? JSON.parse(saved) : data;
  const [items, setItems] = useState<GroceryItem[]>(initial);
  const updateGrocery = (updated: GroceryItem[]) => {
    setItems(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('grocery', JSON.stringify(updated));
    }
  };
  return { items, updateGrocery };
};

export default useGrocery;
