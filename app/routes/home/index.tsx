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
import useGrocery from '~/context/GroceryContext';
import useTodo from '~/context/TodoContext';
import useWarranty from '~/hooks/useWarranty';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Welcome' },
    { name: 'description', content: 'An app for the two of us!' },
  ];
}

export default function Home() {
  const { daysLeft } = useRent();
  const { items: groceryItems } = useGrocery();
  const { warranty } = useWarranty();
  const { totalMonthly } = useSubscription();
  const { items: todoItems } = useTodo();

  const activeGroceryItems = groceryItems.filter((i) => !i.done);
  const activeTodoItems = todoItems.filter((i) => !i.done);
  const sortedWarrantyFirstItem = warranty
    .sort(
      (a, b) =>
        new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime(),
    )
    .at(0);

  return (
    <>
      <div className='grid grid-cols-2 gap-4 p-4'>
        <Link to='/rent'>
          <Tile
            title='Rent'
            value={`${daysLeft == 0 ? 'Today' : daysLeft == 1 ? 'Tomorrow' : daysLeft > 1 ? daysLeft + ' days left' : daysLeft + ' days overdue'}`}
            color='#4A90E2'
            icon={<FaMoneyBillWave />}
            urgency={daysLeft < 0 ? 'high' : ''}
          />
        </Link>
        <Link to='/groceries'>
          <Tile
            title='Groceries'
            value={`${activeGroceryItems.length == 1 ? activeGroceryItems.at(0)?.name + ' to buy' : activeGroceryItems.length > 1 ? activeGroceryItems.length + ' items pending' : 'Nothing to buy'}`}
            color='#0ca987'
            icon={<FaShoppingBasket />}
            urgency={activeGroceryItems.length > 10 ? 'high' : ''}
          />
        </Link>
        <Link to='/warranty'>
          <Tile
            title='Warranty'
            value={`${sortedWarrantyFirstItem?.expiryDate ? new Date(sortedWarrantyFirstItem?.expiryDate).toDateString() : new Date(sortedWarrantyFirstItem?.warrantyEnd || 0).toDateString()}`}
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
            value={`${activeTodoItems.length == 1 ? activeTodoItems.at(0)?.name : activeTodoItems.length > 1 ? activeTodoItems.length + ' items pending' : 'Nothing to do'}`}
            color='#1137a8'
            icon={<FaListAlt />}
            urgency={activeTodoItems.length > 10 ? 'high' : ''}
          />
        </Link>
      </div>
    </>
  );
}
