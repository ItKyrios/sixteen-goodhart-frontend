import type { Route } from './+types';
import { Link, redirect, useLocation } from 'react-router';
import Message from '~/components/Message';
import type { Warranty } from '~/types';
import WarrantyOverviewForm from '~/components/warranty/WarrantyOverviewForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { useAppContext } from '~/context/AppContext';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Warranty' },
    { name: 'description', content: 'A web app for home' },
  ];
}

// Loader: ONLY checks if the user is logged in, else redirect, return null.
export async function loader({ request }: Route.LoaderArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');
  return null;
}

const WarrantyPage = () => {
  const { appState } = useAppContext();
  const warranties = appState.warranty;

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');

  const sortedWarranty = warranties?.sort(
    (a: Warranty, b: Warranty) =>
      new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime(),
  );

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2'>
        <h1 className='text-3xl font-bold text-white mb-2'>Warranty</h1>
        <Link to='/warranty/new'>
          <button className='bg-blue-600 p-2 mb-2 rounded-xs w-full hover:bg-blue-700 active:scale-95 transition-transform cursor-pointer'>
            Add New Item
          </button>
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {!sortedWarranty || sortedWarranty.length === 0 ? (
          <p className='p-2 rounded-xs text-xs flex items-center gap-2'>
            There are no warranty item to show
          </p>
        ) : (
          sortedWarranty.map((w: Warranty) => (
            <Link key={w.documentId} to={`/warranty/edit/${w.documentId}`}>
              <WarrantyOverviewForm warrantyItem={w} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default WarrantyPage;
