import { useState } from 'react';
import type { Subscription } from '~/types';
import data from '~/data/subscriptions.json';

const useSubscription = () => {
  const saved =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('subscriptions')
      : null;
  const initial = saved ? JSON.parse(saved) : data;

  const [subscriptions, setSubscriptions] = useState(<Subscription[]>initial);

  const updateSubscriptions = (updated: Subscription[]) => {
    setSubscriptions(updated);
    localStorage.setItem('subscriptions', JSON.stringify(updated));
  };

  const totalMonthly = subscriptions
    .filter((s) => s.cycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0);
  return { subscriptions, updateSubscriptions, totalMonthly };
};

export default useSubscription;
