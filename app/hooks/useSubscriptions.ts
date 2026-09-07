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

  const totalWeekly = subscriptions
    .filter((s) => s.cycle === 'weekly' && s.status === 'active')
    .reduce((sum, s) => sum + s.amount * 4, 0);

  const totalYearly = subscriptions
    .filter((s) => s.cycle === 'yearly' && s.status === 'active')
    .reduce((sum, s) => sum + s.amount / 12, 0);

  const totalMonthly = subscriptions
    .filter((s) => s.cycle === 'monthly' && s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);

  return {
    subscriptions,
    updateSubscriptions,
    totalMonthly: totalWeekly + totalMonthly + totalYearly,
  };
};

export default useSubscription;
