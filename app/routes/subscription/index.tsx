import type { Route } from './+types';
import { Link, useLocation } from 'react-router';
import useSubscription from '~/context/SubscriptionContext';
import Message from '~/components/Message';
import { useEffect } from 'react';
import type { Subscription } from '~/types';
import { getSubscriptions } from '~/services/subscription.server';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Subscriptions' },
    { name: 'description', content: 'A web app for home' },
  ];
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ subscriptionData: Subscription[] }> {
  const subscriptionData = await getSubscriptions();
  return { subscriptionData };
}

const SubscriptionPage = ({ loaderData }: Route.ComponentProps) => {
  const { subscriptionData } = loaderData;
  const { subscriptions, setSubscriptions, totalMonthly } = useSubscription();
  useEffect(() => {
    setSubscriptions(subscriptionData);
  }, [subscriptionData, setSubscriptions]);

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');

  const sortedSubscriptions = subscriptions.sort(
    (a: Subscription, b: Subscription) =>
      new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime(),
  );

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Subscriptions</h1>

      {message && <Message message={message} />}

      <div className='mb-4 opacity-80'>
        Total Monthly Cost: <strong>${totalMonthly.toFixed(2)}</strong>
      </div>

      <div className='flex flex-col gap-3'>
        {sortedSubscriptions.map((sub) => (
          <Link
            key={sub.documentId}
            to={`/subscription/edit/${sub.documentId}`}
          >
            <div className='bg-gray-900 p-4 rounded-xs shadow-md hover:bg-gray-800 active:bg-gray-800'>
              <div className='text-lg font-medium'>{sub.name}</div>
              <div>
                ${Number(sub.amount).toFixed(2)} / {sub.cycle}
              </div>
              <div>Last: {sub.lastRenewed}</div>
              <div>Next: {sub.nextRenewal}</div>
              <div>Status: {sub.activeStatus ? 'Active' : 'Inactive'}</div>
            </div>
          </Link>
        ))}
        <Link to='/subscription/new'>
          <button className='bg-blue-600 p-3 rounded-xs w-full mt-4 active:scale-95 transition-transform cursor-pointer'>
            Add Subscription
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionPage;
