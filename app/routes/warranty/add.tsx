import type { Route } from './+types';
import { Form, Link, Navigate, redirect, useFetcher } from 'react-router';
import { createWarranty } from '~/services/warranty.server';
import WarrantyForm from '~/components/warranty/WarrantyForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { useAppContext } from '~/context/AppContext';
import { useEffect, useState } from 'react';

export async function action({ request }: Route.ActionArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const form = await request.formData();

  const newItem = {
    name: String(form.get('name')),
    model: String(form.get('model')),
    amount: Number(form.get('amount')),
    purchaseDate: String(form.get('purchaseDate')),
    warrantyEnd: String(form.get('warrantyEnd')),
    notes: String(form.get('notes')),
  };

  await createWarranty(newItem, jwt);
  return redirect(
    '/warranty?message=Warranty item added successfully!&refresh=1',
  );
}

const WarrantyAddPage = () => {
  const fetcher = useFetcher();
  const { appState, setAppState } = useAppContext();
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
        warranty: [...prev.warranty, newItem],
      }));

      // Redirect instantly
      setRedirectToList('/warranty?message=Warranty item added successfully!');
    }
  }, [fetcher.data]);

  if (redirectToList) {
    return <Navigate to={redirectToList} replace />;
  }

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Add Warranty Item</h1>

      <Form method='post' className='flex flex-col gap-3'>
        <WarrantyForm />

        <div className='flex gap-4 text-center justify-between'>
          <button
            type='submit'
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/warranty'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default WarrantyAddPage;
