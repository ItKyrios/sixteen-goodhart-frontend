import type { Route } from './+types';
import { Link, Navigate, redirect, useFetcher, useParams } from 'react-router';
import RentForm from '~/components/rent/RentForm';
import { updateRent } from '~/services/rent.server';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { useAppContext } from '~/context/AppContext';
import { useEffect, useState } from 'react';

// Route params for manual routing
type Params = {
  documentId: string;
};

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

  const updatedRent = {
    amount: Number(form.get('amount')),
    lastPaidDate: String(form.get('lastPaidDate')),
    nextDueDate: String(form.get('nextDueDate')),
    paymentMethod: String(form.get('paymentMethod')),
    notes: String(form.get('notes')),
  };

  // Background update
  updateRent(documentId, updatedRent, jwt).catch((err) => console.error(err));
  return { ok: true, updatedRent };
}

const RentEditPage = () => {
  const fetcher = useFetcher();
  const { documentId } = useParams();
  const { appState, setAppState } = useAppContext();
  const [redirectToList, setRedirectToList] = useState<string | null>(null);

  const rentData = appState.rent.find((e) => e.documentId === documentId);

  useEffect(() => {
    // Update AppContect immediately when the fetcher completes
    if (fetcher.data?.updatedRent) {
      const partial = fetcher.data.updatedRent;

      setAppState((prev) => ({
        ...prev,
        rent: prev.rent.map((item) =>
          item.documentId === documentId ? { ...item, ...partial } : item,
        ),
      }));

      setRedirectToList('/rent?message=Rent updated successfully!');
    }
  }, [fetcher.data]);

  if (redirectToList) {
    return <Navigate to={redirectToList} replace />;
  }

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Edit Rent</h1>

      <fetcher.Form
        method='post'
        className='flex flex-col gap-3 bg-gray-900 p-4 rounded-xs shadow-md-mb-4'
      >
        {/* Component: Edit Rent Form */}
        <RentForm rentData={rentData} />
        <div className='flex gap-4 text-center justify-between'>
          <button
            type='submit'
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/rent'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </fetcher.Form>
    </div>
  );
};

export default RentEditPage;
