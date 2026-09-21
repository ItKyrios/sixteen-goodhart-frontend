import type { Route } from './+types';
import { Form, Link, redirect } from 'react-router';
import SubscriptionForm from '~/components/subscription/SubscriptionForm';
import { createSubscription } from '~/services/subscription.server';

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  const newItem = {
    name: String(form.get('name')),
    amount: Number(form.get('amount')),
    cycle: String(form.get('cycle')),
    lastRenewed: String(form.get('purchaseDate')),
    nextRenewal: String(form.get('expiryDate')),
    notes: String(form.get('notes')),
    activeStatus: form.get('activeStatus') === 'on',
  };

  await createSubscription(newItem);
  return redirect(
    '/subscription?message=Subscription item added successfully!',
  );
}

const SubscriptionAddPage = () => {
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
