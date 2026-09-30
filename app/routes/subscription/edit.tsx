import type { Route } from './+types';
import type { Subscription } from '~/types';
import { Link, Form, redirect } from 'react-router';
import {
  getSubscriptionByDocumentId,
  updateSubscription,
} from '~/services/subscription.server';
import SubscriptionForm from '~/components/subscription/SubscriptionForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

// Route params for manual routing
type Params = { documentId: string };

// Loader: Fetch subscription by documentId
export async function loader({
  params,
  request,
}: Route.LoaderArgs & { params: Params }): Promise<{
  subscription: Subscription;
}> {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const { documentId } = params;
  const subscription = await getSubscriptionByDocumentId(documentId, jwt);
  if (!subscription)
    throw new Response('Subscription not found', { status: 404 });
  return { subscription };
}

// Action: Updated subscription in Strapi
export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const jwt = getJwtFromRequest(request);
  if (!jwt) throw redirect('/login');

  const { documentId } = params;
  const form = await request.formData();

  const updated = {
    name: String(form.get('name')),
    amount: Number(form.get('amount')),
    cycle: String(form.get('cycle')),
    lastRenewed: String(form.get('lastRenewed')),
    nextRenewal: String(form.get('nextRenewal')),
    paymentMethod: String(form.get('paymentMethod')),
    activeStatus: Boolean(form.get('activeStatus')),
    notes: String(form.get('notes')),
  };

  await updateSubscription(documentId, updated, jwt);
  return redirect(
    '/subscription?message=Subscription item updated sucessfully!',
  );
}

const SubscriptionEditPage = ({
  loaderData,
}: {
  loaderData: { subscription: Subscription };
}) => {
  const { subscription } = loaderData;

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>
          Edit Subscription
        </h1>
        <Form method='post' className='ml-auto'>
          <input type='hidden' name='_action' value='delete' />
          <button
            type='submit'
            className='ml-auto bg-red-600 px-8 py-2 mb-2 rounded-full hover:bg-red-700 active:scale-95 transition-transform cursor-pointer'
          >
            Delete
          </button>
        </Form>
      </div>

      <Form method='post' className='flex flex-col gap-3'>
        <SubscriptionForm sub={subscription} />

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

export default SubscriptionEditPage;
