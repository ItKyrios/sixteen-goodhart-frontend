import type { Subscription } from '~/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

type SubscriptionContextValue = {
  subscriptions: Subscription[];
  setSubscriptions: (items: Subscription[]) => void;
  updateLocalSubscription: (updated: Subscription) => void;
  totalMonthly: number;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null,
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const updateLocalSubscription = (updatedItem: Subscription) => {
    setSubscriptions((prev) =>
      prev.map((item) =>
        item.documentId === updatedItem.documentId ? updatedItem : item,
      ),
    );
  };

  let totalMonthly = 0;
  const calcTotalMonthly = subscriptions.map((s) => {
    switch (s.cycle) {
      case 'daily':
        s.activeStatus && (totalMonthly += s.amount * 30);
        break;
      case 'weekly':
        s.activeStatus && (totalMonthly += s.amount * 4);
        break;
      case 'fortnightly':
        s.activeStatus && (totalMonthly += s.amount * 2);
        break;
      case 'monthly':
        s.activeStatus && (totalMonthly += s.amount);
        break;
      case 'annually':
        s.activeStatus && (totalMonthly += s.amount / 12);
        break;

      default:
        break;
    }
  });

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        setSubscriptions,
        updateLocalSubscription,
        totalMonthly,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export default function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error('useExpiry must be used within a ExpiryProvider');
  }
  return ctx;
}
