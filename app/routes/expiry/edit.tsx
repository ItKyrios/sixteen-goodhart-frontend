import type { Route } from './+types';
import type { ExpiryItem } from '~/types';
import { Link, Form, redirect } from 'react-router';
import {
  deleteExpiry,
  getExpiryByDocumentId,
  updateExpiry,
} from '~/services/expiry.server';
import ExpiryForm from '~/components/expiry/ExpiryForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

// Route params for manual routing
type Params = { documentId: string };

// Loader: Fetch expiry by documentId
export async function loader({
  params,
  request,
}: Route.LoaderArgs & { params: Params }): Promise<{ expiry: ExpiryItem }> {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const { documentId } = params;
  const expiry = await getExpiryByDocumentId(documentId, jwt);
  if (!expiry) throw new Response('Expiry item not found', { status: 404 });
  return { expiry };
}

// Action: Update expiry in Strapi
export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const jwt = getJwtFromRequest(request);
  if (!jwt) throw redirect('/login');

  const { documentId } = params;
  const form = await request.formData();
  const actionType = form.get('_action');

  if (actionType === 'delete') {
    await deleteExpiry(documentId, jwt);
    return redirect('/expiry?message=Expiry item deleted successfully!');
  }

  const updated = {
    name: String(form.get('name')),
    model: String(form.get('model')),
    amount: Number(form.get('amount')),
    purchaseDate: String(form.get('purchaseDate')),
    expiryDate: String(form.get('expiryDate')),
    notes: String(form.get('notes')),
  };

  await updateExpiry(documentId, updated, jwt);
  return redirect('/expiry?message=Expiry item updated successfully!');
}

const ExpiryEditPage = ({
  loaderData,
}: {
  loaderData: { expiry: ExpiryItem };
}) => {
  const { expiry } = loaderData;

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>Edit Expiry</h1>
        <Form method='post' className='ml-auto'>
          <input type='hidden' name='_action' value='delete' />
          <button
            type='submit'
            className='bg-red-600 px-8 py-2 mb-2 rounded-full hover:bg-red-700 active:scale-95 transition-transform cursor-pointer'
          >
            Delete
          </button>
        </Form>
      </div>

      <Form method='post' className='flex flex-col gap-3'>
        <ExpiryForm expiryItem={expiry} />

        <div className='flex gap-4 text-center justify-between'>
          <button
            type='submit'
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/expiry'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ExpiryEditPage;
