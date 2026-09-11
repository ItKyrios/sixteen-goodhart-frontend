import type { Route } from './+types';
import type { Rent } from '~/types';
import Message from '~/components/Message';
import { useLocation } from 'react-router';
import { getRents } from '~/services/rent.server';
import RentOverviewForm from '~/components/rent/RentOverviewForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Rent' },
    { name: 'description', content: 'A web app for home' },
  ];
}

export async function loader({ request }: Route.LoaderArgs): Promise<Rent[]> {
  const rentData = await getRents();
  return rentData.rentData;
}

const RentPage = ({ loaderData }: Route.ComponentProps) => {
  const rentData = loaderData;
  const rent = rentData;

  const daysLeft = (() => {
    const due = new Date(rent[0].nextDueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');
  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Rent Overview</h1>
      {message && <Message message={message} />}

      {rent.map((rentData) => (
        <RentOverviewForm rentData={rentData} daysLeft={daysLeft} />
      ))}
    </div>
  );
};

export default RentPage;
