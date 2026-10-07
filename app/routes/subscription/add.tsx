import { useEffect, useState } from 'react';
import type { Route } from './+types';
import { Form, Link, Navigate, redirect, useFetcher } from 'react-router';
import SubscriptionForm from '~/components/subscription/SubscriptionForm';
import { useAppContext } from '~/context/AppContext';
import { createSubscription } from '~/services/subscription.server';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

export async function action({ request }: Route.ActionArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const form = await request.formData();

  const newItem = {
    name: String(form.get('name')),
    amount: Number(form.get('amount')),
    cycle: String(form.get('cycle')),
    lastRenewed: String(form.get('lastRenewed')),
    nextRenewal: String(form.get('nextRenewal')),
    paymentMethod: String(form.get('paymentMethod')),
    activeStatus: Boolean(form.get('activeStatus')),
    notes: String(form.get('notes')),
  };

  await createSubscription(newItem, jwt);
  return redirect(
    '/subscription?message=Subscription item added successfully!&refresh=1',
  );
}

const SubscriptionAddPage = () => {
  const fetcher = useFetcher();
  const { setAppState } = useAppContext();
  const [redirectToList, setRedirectToList] = useState<string | null>(null);

  useEffect(() => {
    if (fetcher.data?.created) {
      const tempId = `temp-${Date.now()}`;

      const newItem = {
        documentId: tempId,
        id: tempId,
        ...fetcher.data.created,
      };

      // Update AppContext immediately
      setAppState((prev) => ({
        ...prev,
        subscription: [...prev.subscription, newItem],
      }));

      // Redirect instantly
      setRedirectToList(
        '/subscription?message=Subscription item added successfully!',
      );
    }
  }, [fetcher.data]);

  if (redirectToList) {
    return <Navigate to={redirectToList} replace />;
  }

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>
        Add Subscription Item
      </h1>

      <Form method='post' className='flex flex-col gap-3'>
        <SubscriptionForm />

        <div className='flex gap-4 text-center justify-between'>
          <button
            type='submit'
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/subscription'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default SubscriptionAddPage;
