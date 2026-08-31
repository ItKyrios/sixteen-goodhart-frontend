import {
  FaClipboardCheck,
  FaCreditCard,
  FaListAlt,
  FaMoneyBillWave,
  FaShoppingBasket,
} from 'react-icons/fa';
import type { Route } from './+types/index';
import { Link } from 'react-router';
import Tile from '~/components/Tile';
import useRent from '~/hooks/useRent';
import useSubscription from '~/hooks/useSubscriptions';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Welcome' },
    { name: 'description', content: 'An app for the two of us!' },
  ];
}

export default function Home() {
  const { daysLeft } = useRent();
  const { subscriptions, totalMonthly } = useSubscription();
  return (
    <>
      <div className='grid grid-cols-2 gap-4 p-4'>
        <Link to='/rent'>
          <Tile
            title='Rent'
            value={`${daysLeft}
            ${daysLeft == 1 || daysLeft == -1 ? 'day' : 'days'} 
            ${daysLeft <= 0 ? 'overdue' : 'left'}`}
            color='#4A90E2'
            icon={<FaMoneyBillWave />}
          />
        </Link>
        <Link to='/groceries'>
          <Tile
            title='Groceries'
            value='3 days left'
            color='#0ca987'
            icon={<FaShoppingBasket />}
          />
        </Link>
        <Link to='/warranty'>
          <Tile
            title='Warranty'
            value='1 year left'
            color='#ab792a'
            icon={<FaClipboardCheck />}
          />
        </Link>
        <Link to='/subscription'>
          <Tile
            title='Subscription'
            value={`Total Cost: $${totalMonthly.toFixed(2)}`}
            color='#9013FE'
            icon={<FaCreditCard />}
          />
        </Link>
        <Link to='/todo'>
          <Tile
            title='Todo'
            value='2 task pending'
            color='#1137a8'
            icon={<FaListAlt />}
          />
        </Link>
      </div>
    </>
  );
}
