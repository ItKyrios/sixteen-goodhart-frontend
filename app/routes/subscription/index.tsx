import { Link, useLocation } from 'react-router';
import useSubscription from '~/hooks/useSubscriptions';
import Message from '~/components/Message';

const SubscriptionPage = () => {
  const { subscriptions, totalMonthly } = useSubscription();
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Subscriptions</h1>

      {message && <Message message={message} />}

      <div className='mb-4 opacity-80'>
        Total Monthly Cost: <strong>${totalMonthly.toFixed(2)}</strong>
      </div>

      <div className='flex flex-col gap-3'>
        {subscriptions.map((sub) => (
          <Link key={sub.id} to={`/subscription/edit/${sub.id}`}>
            <div className='bg-gray-900 p-4 rounded-xs shadow-md hover:bg-gray-800 active:bg-gray-800'>
              <div className='text-lg font-medium'>{sub.name}</div>
              <div>
                ${Number(sub.amount).toFixed(2)} / {sub.cycle}
              </div>
              <div>Last: {sub.lastRenewed}</div>
              <div>Next: {sub.nextRenewal}</div>
              <div>Status: {sub.status}</div>
            </div>
          </Link>
        ))}
        <Link to='/subscription/edit/new'>
          <button className='bg-blue-600 p-3 rounded-xs w-full mt-4 active:scale-95 transition-transform cursor-pointer'>
            Add Subscription
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionPage;
