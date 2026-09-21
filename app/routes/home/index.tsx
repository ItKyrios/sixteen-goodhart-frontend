import {
  FaClipboardCheck,
  FaClock,
  FaCreditCard,
  FaListAlt,
  FaMoneyBillWave,
  FaShoppingBasket,
} from 'react-icons/fa';
import type { Route } from './+types/index';
import { Link, redirect, useFetcher } from 'react-router';
import Tile from '~/components/Tile';
import useSubscription from '~/context/SubscriptionContext';
import useGrocery from '~/context/GroceryContext';
import useTodo from '~/context/TodoContext';
import useWarranty from '~/context/WarrantyContext';
import useExpiry from '~/context/ExpiryContext';
import { getGroceries, createGrocery } from '~/services/grocery.server';
import type {
  ExpiryItem,
  GroceryItem,
  StrapiRent,
  StrapiTodo,
  Subscription,
  Warranty,
} from '~/types';
import { useEffect, useState } from 'react';
import { getTodos, createTodo } from '~/services/todo.server';
import { getRents } from '~/services/rent.server';
import useRent from '~/context/RentContext';
import { getWarranties } from '~/services/warranty.server';
import { getExpiries } from '~/services/expiry.server';
import { getSubscriptions } from '~/services/subscription.server';
import QuickAddForm from '~/components/QuickAddForm';
import Message from '~/components/Message';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Welcome' },
    { name: 'description', content: 'An app for the two of us!' },
  ];
}

// Fetching  rent, groceries, todo, warranty, expiry and subscription data from strapi
export async function loader({ request }: Route.LoaderArgs): Promise<{
  rent: StrapiRent[];
  groceriesData: GroceryItem[];
  todosData: StrapiTodo[];
  warrantyData: Warranty[];
  expiryData: ExpiryItem[];
  subscriptionData: Subscription[];
}> {
  const rentData = await getRents();
  const groceriesData = await getGroceries();
  const todosData = await getTodos();
  const warrantyData = await getWarranties();
  const expiryData = await getExpiries();
  const subscriptionData = await getSubscriptions();

  const rent = rentData.rentData;
  return {
    rent,
    groceriesData,
    todosData,
    warrantyData,
    expiryData,
    subscriptionData,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  const type = form.get('type'); //"grocery" or "todo"
  const name = String(form.get('name'));

  if (!name.trim()) {
    return redirect('/?message=Please enter a grocery item or a todo');
  }

  if (type === 'grocery') {
    await createGrocery({
      name,
      quantity: 1,
      assignedTo: 'You',
      category: 'others',
      priority: 'medium',
      done: false,
    });
  }

  if (type === 'todo') {
    await createTodo({
      name,
      assignedTo: 'You',
      category: '',
      priority: 'medium',
      dueDate: '',
      done: false,
    });
  }

  return { ok: true };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [quickMessage, setQuickMesage] = useState('');
  const fetcher = useFetcher();
  const {
    rent,
    groceriesData,
    todosData,
    warrantyData,
    expiryData,
    subscriptionData,
  } = loaderData;
  // Setting up rent data to global context
  const { calcDaysLeft } = useRent();
  const daysLeft = calcDaysLeft(rent[0]);

  // Setting up groceries data to global context
  const { groceries: groceryItems, setGroceries } = useGrocery();
  useEffect(() => {
    setGroceries(groceriesData);
  }, [groceriesData, setGroceries]);

  // Setting up todos data to global context
  const { todos: todoItems, setTodos } = useTodo();
  useEffect(() => {
    setTodos(todosData);
  }, [todosData, setTodos]);

  // Setting up warranties to global context
  const { setWarranties } = useWarranty();
  useEffect(() => {
    setWarranties(warrantyData);
  }, [warrantyData, setWarranties]);

  // Setting up expiries to global context
  const { setExpiries } = useExpiry();
  useEffect(() => {
    setExpiries(expiryData);
  }, [expiryData, setExpiries]);

  // Setting up subscriptions to global context
  const { setSubscriptions } = useSubscription();
  useEffect(() => {
    setSubscriptions(subscriptionData);
  }, [subscriptionData, setSubscriptions]);

  const { totalMonthly } = useSubscription();

  const activeGroceryItems = groceryItems.filter((i) => !i.done);
  const activeTodoItems = todoItems.filter((i) => !i.done);
  const currentDate = new Date();
  const sortedWarrantyFirstItem = warrantyData
    .sort(
      (a, b) =>
        new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime(),
    )
    .at(0);

  const sortedExpiryFirstItem = expiryData
    .sort(
      (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    )
    .at(0);

  // Using Fetcher for Quick add of Grocery and Todo items
  useEffect(() => {
    if (fetcher.state === 'submitting') {
      const type = fetcher.formData?.get('type');
      const name = String(fetcher.formData?.get('name'));

      if (type === 'grocery') {
        setGroceries((prev) => [
          ...prev,
          {
            id: '',
            name,
            assignedTo: 'You',
            category: 'others',
            priority: 'medium',
            quantity: 1,
            done: false,
          },
        ]);
        setQuickMesage(`Added grocery: ${name}`);
      }

      if (type === 'todo') {
        setTodos((prev) => [
          ...prev,
          {
            id: '',
            documentId: '',
            name,
            assignedTo: 'You',
            category: '',
            priority: 'medium',
            dueDate: '',
            done: false,
          },
        ]);
        setQuickMesage(`Added todo: ${name}`);
      }
    }
  }, [fetcher.state]);

  return (
    <>
      <fetcher.Form
        method='post'
        className='text-center py-10 bg-gray-900 text-white'
      >
        <QuickAddForm fetcher={fetcher} />
      </fetcher.Form>

      {quickMessage && <Message message={quickMessage} />}

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
