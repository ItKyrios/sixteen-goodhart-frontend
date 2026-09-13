import {
  FaClipboardCheck,
  FaClock,
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
import useExpiry from '~/context/ExpiryContext';
import { getGroceries } from '~/services/grocery.server';
import type { GroceryItem } from '~/types';
import { useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Welcome' },
    { name: 'description', content: 'An app for the two of us!' },
  ];
}

// Fetching groceries data from strapi
export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ groceriesData: GroceryItem[] }> {
  const groceriesData = await getGroceries();
  return { groceriesData };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  // Setting up groceries data to global context
  const { groceriesData } = loaderData;
  const { groceries: groceryItems, setGroceries } = useGrocery();
  useEffect(() => {
    setGroceries(groceriesData);
  }, [groceriesData, setGroceries]);

  const { daysLeft } = useRent();
  const { warranty } = useWarranty();
  const { items: expiryItems } = useExpiry();
  const { totalMonthly } = useSubscription();
  const { items: todoItems } = useTodo();

  const activeGroceryItems = groceryItems.filter((i) => !i.done);
  const activeTodoItems = todoItems.filter((i) => !i.done);
  const currentDate = new Date();
  const sortedWarrantyFirstItem = warranty
    .sort(
      (a, b) =>
        new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime(),
    )
    .at(0);

  const sortedExpiryFirstItem = expiryItems
    .sort(
      (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
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
            value={new Date(
              sortedWarrantyFirstItem?.warrantyEnd || 0,
            ).toDateString()}
            color='#ab792a'
            icon={<FaClipboardCheck />}
            urgency={
              new Date(sortedWarrantyFirstItem?.warrantyEnd || 0).getTime() <
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate(),
              ).getTime()
                ? 'high'
                : ''
            }
          />
        </Link>
        <Link to='/expiry'>
          <Tile
            title='Expiry'
            value={new Date(
              sortedExpiryFirstItem?.expiryDate || 0,
            ).toDateString()}
            color='#ab352a'
            icon={<FaClock />}
            urgency={
              new Date(sortedExpiryFirstItem?.expiryDate || 0).getTime() <
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 4,
              ).getTime()
                ? 'high'
                : ''
            }
          />
        </Link>
        <Link to='/subscription'>
          <Tile
            title='Subscription'
            value={`Total Cost: $${totalMonthly.toFixed(2)}/m`}
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
