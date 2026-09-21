import type { Warranty } from '~/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

type WarrantyContextValue = {
  warranties: Warranty[];
  setWarranties: (items: Warranty[]) => void;
  updateLocalWarranty: (item: Warranty) => void;
};

const WarrantyContext = createContext<WarrantyContextValue | null>(null);

export function WarrantyProvider({ children }: { children: ReactNode }) {
  const [warranties, setWarranties] = useState<Warranty[]>([]);

  const updateLocalWarranty = (updatedItem: Warranty) => {
    setWarranties((prev) =>
      prev.map((item) =>
        item.documentId === updatedItem.documentId ? updatedItem : item,
      ),
    );
  };

  return (
    <WarrantyContext.Provider
      value={{ warranties, setWarranties, updateLocalWarranty }}
    >
      {children}
    </WarrantyContext.Provider>
  );
}

export default function useWarranty() {
  const ctx = useContext(WarrantyContext);
  if (!ctx) {
    throw new Error('useWarranty must be used within a WarrantyProvider');
  }
  return ctx;
}
