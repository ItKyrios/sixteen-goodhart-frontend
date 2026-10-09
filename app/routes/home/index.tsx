import {
  FaClipboardCheck,
  FaClock,
  FaCreditCard,
  FaListAlt,
  FaMoneyBillWave,
  FaShoppingBasket,
} from 'react-icons/fa';
import type { Route } from './+types/index';
import { useEffect, useRef, useState } from 'react';
import { Link, redirect, useFetcher } from 'react-router';
import { useAppContext } from '~/context/AppContext';
import Tile from '~/components/Tile';
import QuickAddForm from '~/components/QuickAddForm';
import Message from '~/components/Message';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import fetchAllUserData from '~/utills/fetchAllUserData';
import { createGrocery } from '~/services/grocery.server';
import { createTodo } from '~/services/todo.server';
import { BarLoader } from 'react-spinners';
import { playSound } from 'react-sounds';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Welcome' },
    { name: 'description', content: 'An app for the two of us!' },
  ];
}

// Fetching all modules data from strapi
export async function loader({ request }: Route.LoaderArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  return await fetchAllUserData(jwt || '');
}

export async function action({ request }: Route.ActionArgs) {
  const jwt = getJwtFromRequest(request);
  const form = await request.formData();

  const type = form.get('type'); //"grocery" or "todo"
  const name = String(form.get('name'));

  if (!name.trim()) {
    return redirect('/?message=Please enter a grocery item or a todo');
  }

  if (type === 'grocery') {
    const realItem = await createGrocery(
      {
        name,
        quantity: 1,
        assignedTo: 'You',
        category: 'others',
        priority: 'medium',
        done: false,
      },
      jwt || '',
    );

    return { ok: true, created: realItem };
  }

  if (type === 'todo') {
    const realItem = await createTodo(
      {
        name,
        assignedTo: 'You',
        category: 'others',
        priority: 'medium',
        dueDate: `${new Date().toLocaleDateString('en-CA')}`,
        done: false,
      },
      jwt || '',
    );
    return { ok: true, created: realItem };
  }
  return { ok: true };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { appState, setAppState, calcDaysLeft, totalMonthly } = useAppContext();
  const [quickMessage, setQuickMesage] = useState('');
  const [isInstantLoading, setIsInstantLoading] = useState(false);
  const didSubmitRef = useRef(false);
  const shouldFlipRef = useRef(false);
  const fetcher = useFetcher();

  // Hydrate global state once
  useEffect(() => {
    if (!appState.loaded) {
      setAppState((prev) => ({
        ...prev,
        expiry: loaderData.expiryData,
        warranty: loaderData.warrantyData,
        groceries: loaderData.groceriesData,
        rent: loaderData.rentData,
        subscription: loaderData.subscriptionData,
        todo: loaderData.todosData,
        loaded: true,
      }));
    }
  }, [appState.loaded, loaderData, setAppState]);

  const { expiry, warranty, groceries, rent, subscription, todo } = appState;

  // Setting up rent data to global context
  const daysLeft = calcDaysLeft(rent[0]);
  const daysLeftMessage = !Number.isNaN(daysLeft)
    ? daysLeft == 0
      ? 'Today'
      : daysLeft == 1
        ? 'Tomorrow'
        : daysLeft > 1
          ? daysLeft + ' days left'
          : daysLeft + ' days overdue'
    : 'No rent record';

  const activeGroceryItems = groceries.filter((i) => !i.done);
  const activeTodoItems = todo.filter((i) => !i.done);

  const currentDate = new Date();
  const sortedWarrantyFirstItem = warranty
    ?.sort(
      (a, b) =>
        new Date(a.warrantyEnd).getTime() - new Date(b.warrantyEnd).getTime(),
    )
    .at(0);

  const sortedExpiryFirstItem = expiry
    ?.sort(
      (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    )
    .at(0);

  // QUICK ADD - Optimistic insert + Real item replacement
  useEffect(() => {
    // 1. Optimistic insert (Fast UI)
    if (fetcher.state !== 'submitting') return;

    const type = fetcher.formData?.get('type');
    const name = String(fetcher.formData?.get('name'));

    if (type === 'grocery') {
      setAppState((prev) => ({
        ...prev,
        groceries: [
          ...prev.groceries,
          {
            id: '',
            name,
            assignedTo: 'You',
            category: 'others',
            priority: 'medium',
            quantity: 1,
            done: false,
          },
        ],
      }));
      setQuickMesage(`Added grocery: ${name}`);
    }

    if (type === 'todo') {
      setAppState((prev) => ({
        ...prev,
        todo: [
          ...prev.todo,
          {
            id: '',
            name,
            assignedTo: 'You',
            category: 'others',
            priority: 'medium',
            dueDate: `${new Date().toLocaleDateString('en-CA')}`,
            done: false,
          },
        ],
      }));
      setQuickMesage(`Added todo: ${name}`);
    }
  }, [fetcher.state]);

  useEffect(() => {
    // 2. Replace optimistic item with real Strapi item
    if (!fetcher.data?.created) return;
    const realItem = fetcher.data.created;
    const type = fetcher.formData?.get('type');

    setAppState((prev) => {
      if (type === 'grocery') {
        const filtered = prev.groceries.filter((i) => typeof i.id === 'number');
        return {
          ...prev,
          groceries: [...filtered, realItem],
        };
      }

      if (type === 'todo') {
        const filtered = prev.todo.filter((i) => typeof i.id === 'number');
        return {
          ...prev,
          todo: [...filtered, realItem],
        };
      }
      return prev;
    });
  }, [fetcher.data]);

  useEffect(() => {
    // 3. Reset instant loading ONLY when fetcher is idle
    if (fetcher.state === 'idle') {
      setIsInstantLoading(false);
      if (didSubmitRef.current) {
        playSound('notification/info');
        didSubmitRef.current = false;
        shouldFlipRef.current = false;
      }
    }
  }, [fetcher.state]);

  return (
    <>
      <fetcher.Form
        method='post'
        onSubmit={() => {
          setIsInstantLoading(true);
          didSubmitRef.current = true;
          shouldFlipRef.current = true;
        }}
      >
        {isInstantLoading && <BarLoader color={'lime'} width={'100%'} />}
        <QuickAddForm fetcher={fetcher} disabled={isInstantLoading} />
      </fetcher.Form>

      {quickMessage && <Message message={quickMessage} />}

      <div className='grid grid-cols-2 gap-4 p-4'>
        <Link to='/rent'>
          <Tile
            title='Rent'
            value={daysLeftMessage}
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
            shouldFlip={shouldFlipRef.current}
          />
        </Link>
        <Link to='/warranty'>
          <Tile
            title='Warranty'
            value={
              !sortedWarrantyFirstItem
                ? 'No Warrant record'
                : new Date(
                    sortedWarrantyFirstItem?.warrantyEnd || 0,
                  ).toDateString()
            }
            color='#ab792a'
            icon={<FaClipboardCheck />}
            urgency={
              !sortedWarrantyFirstItem
                ? ''
                : new Date(
                      sortedWarrantyFirstItem?.warrantyEnd || 0,
                    ).getTime() <
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
            value={
              !sortedExpiryFirstItem
                ? 'No Expiry record'
                : new Date(
                    sortedExpiryFirstItem?.expiryDate || 0,
                  ).toDateString()
            }
            color='#ab352a'
            icon={<FaClock />}
            urgency={
              !sortedExpiryFirstItem
                ? ''
                : new Date(sortedExpiryFirstItem?.expiryDate || 0).getTime() <
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
            shouldFlip={shouldFlipRef.current}
          />
        </Link>
      </div>
    </>
  );
}
