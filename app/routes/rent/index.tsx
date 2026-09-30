import type { Route } from './+types';
import type { StrapiRent } from '~/types';
import Message from '~/components/Message';
import { redirect, useLocation } from 'react-router';
import { getRents } from '~/services/rent.server';
import RentOverviewForm from '~/components/rent/RentOverviewForm';
import useRent from '~/context/RentContext';
import { useEffect } from 'react';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Rent' },
    { name: 'description', content: 'A web app for home' },
  ];
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ rentData: StrapiRent[] }> {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const rentData = await getRents(jwt);
  return { rentData };
}

const RentPage = ({ loaderData }: Route.ComponentProps) => {
  const { rentData } = loaderData;
  const { rents: rent, setRents, calcDaysLeft } = useRent();
  useEffect(() => {
    setRents(rentData);
  }, [rentData, setRents]);

  const daysLeft = calcDaysLeft(rentData[0]);

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');
  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Rent Overview</h1>
      {message && <Message message={message} />}

      {rent &&
        rent.map((rentItem) => (
          <RentOverviewForm
            key={rentItem.documentId}
            rentData={rentItem}
            daysLeft={daysLeft}
          />
        ))}
    </div>
  );
};

export default RentPage;
