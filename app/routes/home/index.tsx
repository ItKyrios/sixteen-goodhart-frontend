import {
  FaClipboardCheck,
  FaCreditCard,
  FaMoneyBillWave,
  FaShoppingBasket,
} from 'react-icons/fa';
import type { Route } from './+types/index';
import { Link } from 'react-router';
import Tile from '~/components/Tile';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Welcome' },
    { name: 'description', content: 'An app for the two of us!' },
  ];
}

export default function Home() {
  return (
    <div className='grid grid-cols-2 gap-4 p-4'>
      <Link to='/rent'>
        <Tile
          title='Rent'
          value='5 days left'
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
          value='2 months left'
          color='#9013FE'
          icon={<FaCreditCard />}
        />
      </Link>
    </div>
  );
}
