import type { Route } from './+types';
import { Link, redirect, useParams, useFetcher, Navigate } from 'react-router';
import { deleteExpiry, updateExpiry } from '~/services/expiry.server';
import ExpiryForm from '~/components/expiry/ExpiryForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { useAppContext } from '~/context/AppContext';
import { useEffect, useState } from 'react';

// Route params for manual routing
type Params = { documentId: string };

// Loader: ONLY checks if the user is logged in, else redirect, return null.
export async function loader({ request }: Route.LoaderArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');
  return null;
}

// Action: ONLY update Strapi (no AppContext here)
export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const { documentId } = params;
  const form = await request.formData();
  const actionType = form.get('_action');

  if (actionType === 'delete') {
    // Background delete
    deleteExpiry(documentId, jwt).catch((err) => console.error(err));
    return { od: true, deleted: true };
  }

  const updated = {
    name: String(form.get('name')),
    model: String(form.get('model')),
    amount: Number(form.get('amount')),
    purchaseDate: String(form.get('purchaseDate')),
    expiryDate: String(form.get('expiryDate')),
    notes: String(form.get('notes')),
  };

  // Background update
  updateExpiry(documentId, updated, jwt).catch((err) => console.error(err));
  return { ok: true, updated };
}

const ExpiryEditPage = () => {
  const fetcher = useFetcher();
  const { documentId } = useParams();
  const { appState, setAppState } = useAppContext();
  const [redirectToList, setRedirectToList] = useState<string | null>(null);

  const expiry = appState.expiry.find((e) => e.documentId === documentId);

  useEffect(() => {
    // Update AppContect immediately when the fetcher completes
    if (fetcher.data?.updated) {
      const partial = fetcher.data.updated;

      setAppState((prev) => ({
        ...prev,
        expiry: prev.expiry.map((item) =>
          item.documentId === documentId ? { ...item, ...partial } : item,
        ),
      }));

      setRedirectToList('/expiry?message=Expiry item updated successfully!');
    }

    // Delete from AppContext
    if (fetcher.data?.deleted) {
      setAppState((prev) => ({
        ...prev,
        expiry: prev.expiry.filter((item) => item.documentId !== documentId),
      }));

      setRedirectToList('/expiry?message=Expiry item deleted successfully!');
    }
  }, [fetcher.data]);

  if (redirectToList) {
    return <Navigate to={redirectToList} replace />;
  }

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>Edit Expiry</h1>

        <fetcher.Form method='post' className='ml-auto'>
          <input type='hidden' name='_action' value='delete' />
          <button
            type='submit'
            className='bg-red-600 px-8 py-2 mb-2 rounded-full hover:bg-red-700 active:scale-95 transition-transform cursor-pointer'
          >
            Delete
          </button>
        </fetcher.Form>
      </div>

      <fetcher.Form method='post' className='flex flex-col gap-3'>
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
      </fetcher.Form>
    </div>
  );
};

export default ExpiryEditPage;
