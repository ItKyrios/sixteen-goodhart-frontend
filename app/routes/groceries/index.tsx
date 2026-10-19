import type { Route } from './+types';
import {
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  useLocation,
} from 'react-router';
import Message from '~/components/Message';
import {
  deleteGrocery,
  getGroceries,
  updateGrocery,
} from '~/services/grocery.server';
import { useEffect, useState } from 'react';
import CheckListItem from '~/components/CheckListItem';
import DoneCheckListItem from '~/components/DoneCheckListItem';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { useAppContext } from '~/context/AppContext';
import type { CheckListItemBase } from '~/types';
import { playSound } from 'react-sounds';
import HoldButton from '~/components/ui/HoldButton';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Groceries' },
    { name: 'description', content: 'A web app for home' },
  ];
}
// Route params for manual routing
type Params = { documentId: string };

// Loader: Check if user is logged in else redirect and fetch data if redirected from add page
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const shouldRefresh = url.searchParams.get('refresh') === '1';

  if (!shouldRefresh) {
    // No SSR fetch needed
    return null;
  }

  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const groceryData = await getGroceries(jwt);
  return groceryData;
}

// Action: ONLY update Strapi (no AppContext here)
export async function action({
  request,
}: Route.ActionArgs & { params: Params }) {
  const jwt = getJwtFromRequest(request);
  if (!jwt) throw redirect('/login');

  const form = await request.formData();
  const actionType = form.get('_action');
  const documentId = String(form.get('documentId'));

  if (actionType === 'toggle') {
    const done = form.get('done') === 'true';

    // Background update
    updateGrocery(documentId, { done }, jwt).catch((err) => console.error(err));
    return { ok: true, toggle: { documentId, done } };
  }

  if (actionType === 'delete') {
    // Background delete
    deleteGrocery(documentId, jwt).catch((err) => console.error(err));
    return { ok: true, deleted: documentId };
  }

  if (actionType === 'delete-all-done') {
    const doneIds = JSON.parse(String(form.get('doneIds')));

    // Background delete all completed
    doneIds.forEach((documentId: string) => {
      deleteGrocery(documentId, jwt).catch((err) => console.error(err));
    });
    return { ok: true, deletedAll: true, deletedIds: doneIds };
  }

  return null;
}

const GroceriesPage = () => {
  const fetcher = useFetcher();
  const loaderData = useLoaderData<typeof loader>();
  const [showDone, setShowDone] = useState(false);
  const { appState, setAppState } = useAppContext();

  useEffect(() => {
    if (loaderData && loaderData.length !== appState.groceries.length) {
      // SSR hydration ONLY after create
      setAppState((prev) => ({
        ...prev,
        groceries: loaderData,
      }));
    }
  }, [loaderData]);

  const groceries = appState.groceries;

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');

  const toggleDone = (item: CheckListItemBase) => {
    playSound('notification/completed');
    fetcher.submit(
      {
        _action: 'toggle',
        documentId: String(item.documentId),
        done: (!item.done).toString(),
      },
      { method: 'post' },
    );

    // Optimistic update immediately
    setAppState((prev) => ({
      ...prev,
      groceries: prev.groceries.map((g) =>
        g.documentId === item.documentId ? { ...g, done: !item.done } : g,
      ),
    }));
  };

  const deleteItem = (documentId: string) => {
    playSound('notification/popup');
    fetcher.submit(
      { _action: 'delete', documentId: String(documentId) },
      { method: 'post' },
    );

    // Optimistic delete
    setAppState((prev) => ({
      ...prev,
      groceries: prev.groceries.filter((g) => g.documentId !== documentId),
    }));
  };

  const activeItems = groceries?.filter((i) => !i.done);
  const doneItems = groceries?.filter((i) => i.done);

  // Apply optimistic updates
  useEffect(() => {
    if (fetcher.data?.toggle) {
      const { documentId, done } = fetcher.data.toggle;

      setAppState((prev) => ({
        ...prev,
        groceries: prev.groceries.map((item) =>
          item.documentId === documentId ? { ...item, done } : item,
        ),
      }));
    }

    if (fetcher.data?.deleted) {
      const documentId = fetcher.data.deleted;

      setAppState((prev) => ({
        ...prev,
        groceries: prev.groceries.filter(
          (item) => item.documentId !== documentId,
        ),
      }));
    }

    if (fetcher.data?.deletedAll) {
      const deletedIds = fetcher.data.deletedIds;

      setAppState((prev) => ({
        ...prev,
        groceries: prev.groceries.filter(
          (item) => !deletedIds.includes(item.documentId),
        ),
      }));
    }
  }, [fetcher.data]);

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>Groceries</h1>
        <Link
          to='/groceries/new'
          className='ml-auto bg-green-600 px-8 py-2 mb-2 rounded-full hover:bg-green-700 active:scale-95 transition-transform cursor-pointer'
        >
          Add
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {!activeItems || activeItems.length === 0 ? (
          <p className='p-2 rounded-xs text-xs flex items-center gap-2 opacity-70'>
            Your groceries list is empty
          </p>
        ) : (
          <fetcher.Form method='post'>
            {activeItems.map((item) => (
              <div key={item.documentId}>
                <input type='hidden' name='_action' value='delete' />
                <input type='hidden' name='_docId' value={item.documentId} />
                <CheckListItem
                  item={{
                    documentId: String(item.documentId),
                    label: item.name,
                    assignedTo: item.assignedTo,
                    quantity: item.quantity || undefined,
                    done: item.done,
                    priority: item.priority,
                  }}
                  onToggleDone={toggleDone}
                  onDeleteItem={deleteItem}
                />
              </div>
            ))}
          </fetcher.Form>
        )}
      </div>

      {/* Completed Items */}
      <div className='mt-6'>
        <div className='flex items-center'>
          <button
            onClick={() => setShowDone(!showDone)}
            className='w-full bg-gray-800 p-2 rounded-xs text-left flex justify-between items-center'
          >
            <span className='text-sm font-semibold'>
              {showDone ? 'Hide' : 'View'} Completed Items
            </span>
            <span>{showDone ? '▲' : '▼'}</span>
          </button>

          {doneItems?.length > 0 && (
            <HoldButton
              doneLabel='Deleted'
              backgroundColor='#3f0d0d'
              fillColor='#dc2626'
              textColor='#fef2f2'
              fillTextColor='#ffffff'
              size='sm'
              radius={3}
              className='ml-2'
              onHold={() => {
                playSound('notification/popup');

                fetcher.submit(
                  {
                    _action: 'delete-all-done',
                    doneIds: JSON.stringify(doneItems.map((i) => i.documentId)),
                  },
                  { method: 'post' },
                );
              }}
            >
              Clear Completed
            </HoldButton>
          )}
        </div>

        {showDone && (
          <div className='flex flex-col gap-2 mt-3'>
            {!doneItems || doneItems?.length === 0 ? (
              <p className='bg-gray-800 p-2 rounded-xs text-xs flex items-center gap-2 opacity-70'>
                No completed items
              </p>
            ) : (
              doneItems.map((item) => (
                <DoneCheckListItem
                  key={item.documentId}
                  item={{
                    documentId: String(item.documentId),
                    label: item.name,
                    done: item.done,
                  }}
                  onToggleDone={toggleDone}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceriesPage;
