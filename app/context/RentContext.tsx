import type { StrapiRent } from '~/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

type RentContextValue = {
  rents: StrapiRent[];
  setRents: (items: StrapiRent[]) => void;
  updateLocalRent: (item: StrapiRent) => void;
  calcDaysLeft: (item: StrapiRent) => number;
};

const RentContext = createContext<RentContextValue | null>(null);

export function RentProvider({ children }: { children: ReactNode }) {
  const [rents, setRents] = useState<StrapiRent[]>([]);

  const updateLocalRent = (updatedItem: StrapiRent) => {
    setRents((prev) =>
      prev.map((item) =>
        item.documentId === updatedItem.documentId ? updatedItem : item,
      ),
    );
  };

  const calcDaysLeft = (rentItem: StrapiRent) => {
    const due = new Date(rentItem.nextDueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <RentContext.Provider
      value={{ rents, setRents, updateLocalRent, calcDaysLeft }}
    >
      {children}
    </RentContext.Provider>
  );
}

export default function useRent() {
  const ctx = useContext(RentContext);
  if (!ctx) {
    throw new Error('useRent must be used within a RentProvider');
  }
  return ctx;
}
