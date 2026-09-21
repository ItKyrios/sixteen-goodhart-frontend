import type { Route } from './+types';
import { Link, useLocation } from 'react-router';
import useExpiry from '~/context/ExpiryContext';
import Message from '~/components/Message';
import { useEffect } from 'react';
import type { ExpiryItem } from '~/types';
import { getExpiries } from '~/services/expiry.server';
import ExpiryOverviewForm from '~/components/expiry/ExpiryOverviewForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Expiry' },
    { name: 'description', content: 'A web app for home' },
  ];
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ expiryData: ExpiryItem[] }> {
  const expiryData = await getExpiries();
  return { expiryData };
}

const ExpiryPage = ({ loaderData }: Route.ComponentProps) => {
  const { expiryData } = loaderData;
  const { expiries, setExpiries } = useExpiry();
  useEffect(() => {
    setExpiries(expiryData);
  }, [expiryData, setExpiries]);

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');

  const sortedExpiry = expiries.sort(
    (a: ExpiryItem, b: ExpiryItem) =>
      new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
  );

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2'>
        <h1 className='text-3xl font-bold text-white mb-2'>Expiry</h1>
        <Link to='/expiry/edit/new'>
          <button className='bg-blue-600 p-2 mb-2 rounded-xs w-full hover:bg-blue-700 active:scale-95 transition-transform cursor-pointer'>
            Add New Item
          </button>
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {sortedExpiry.map((w) => (
          <Link key={w.documentId} to={`/expiry/edit/${w.documentId}`}>
            <ExpiryOverviewForm expiryItem={w} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExpiryPage;
