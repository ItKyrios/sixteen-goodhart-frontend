import type { Route } from './+types';
import Message from '~/components/Message';
import { redirect, useLocation } from 'react-router';
import RentOverviewForm from '~/components/rent/RentOverviewForm';
import { useAppContext } from '~/context/AppContext';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Rent' },
    { name: 'description', content: 'A web app for home' },
  ];
}

// Loader: ONLY checks if the user is logged in, else redirect, return null.
export async function loader({ request }: Route.LoaderArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');
  return null;
}

const RentPage = () => {
  const { appState, calcDaysLeft } = useAppContext();
  const rent = appState.rent;

  const daysLeft = calcDaysLeft(rent[0]);

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
