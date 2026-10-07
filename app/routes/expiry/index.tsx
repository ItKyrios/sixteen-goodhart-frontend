import type { Route } from './+types';
import { Link, redirect, useLoaderData, useLocation } from 'react-router';
import Message from '~/components/Message';
import type { ExpiryItem } from '~/types';
import ExpiryOverviewForm from '~/components/expiry/ExpiryOverviewForm';
import { useAppContext } from '~/context/AppContext';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { getExpiries } from '~/services/expiry.server';
import { useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Expiry' },
    { name: 'description', content: 'A web app for home' },
  ];
}

// Loader: Check if user is logged in else redirect and fetch data if redirected from add page
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const shouldRefresh = url.searchParams.get('refresh') === '1';
  if (!shouldRefresh) {
    // No SSR fetch needed
    return null;
  }

  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const expiryData = await getExpiries(jwt);
  return expiryData;
}

const ExpiryPage = () => {
  const loaderData = useLoaderData<typeof loader>();
  const { appState, setAppState } = useAppContext();

  useEffect(() => {
    if (loaderData) {
      // SSR hydration ONLY after create
      setAppState((prev) => ({
        ...prev,
        expiry: loaderData,
      }));
    }
  }, [loaderData]);

  const expiries = appState.expiry;
  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');

  const sortedExpiry = expiries?.sort(
    (a: ExpiryItem, b: ExpiryItem) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
  );

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2'>
        <h1 className='text-3xl font-bold text-white mb-2'>Expiry</h1>
        <Link to='/expiry/new'>
          <button className='bg-blue-600 p-2 mb-2 rounded-xs w-full hover:bg-blue-700 active:scale-95 transition-transform cursor-pointer'>
            Add New Item
          </button>
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {!sortedExpiry || sortedExpiry.length === 0 ? (
          <p className='p-2 rounded-xs text-xs flex items-center gap-2 opacity-70'>
            There are no expiry item to show
          </p>
        ) : (
          sortedExpiry.map((w) => (
            <Link key={w.documentId} to={`/expiry/edit/${w.documentId}`}>
              <ExpiryOverviewForm expiryItem={w} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpiryPage;
