import { useState } from 'react';
import rentData from '../data/rent.json';

const useRent = () => {
  const [rent, setRent] = useState(rentData);

  const updateRent = (updated: any) => {
    setRent(updated);
    // later: write to Strapi
  };

  const daysLeft = (() => {
    const due = new Date(rent.nextDueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  return { rent, updateRent, daysLeft };
};

export default useRent;
