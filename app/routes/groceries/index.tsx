import type { Route } from './+types';
import { Form, Link, redirect, useLocation } from 'react-router';
import useGrocery from '~/context/GroceryContext';
import Message from '~/components/Message';
import type { GroceryItem } from '~/types';
import { deleteGrocery, getGroceries } from '~/services/grocery.server';
import { useEffect, useState } from 'react';
import CheckListItem from '~/components/CheckListItem';
import DoneCheckListItem from '~/components/DoneCheckListItem';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Groceries' },
    { name: 'description', content: 'A web app for home' },
  ];
}
// Route params for manual routing
type Params = { documentId: string };

// Loader: Fetch grocery by documentId
export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ groceriesData: GroceryItem[] }> {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const groceriesData = await getGroceries(jwt);
  return { groceriesData };
}

// Action: Update grocery in Strapi
export async function action({
  request,
}: Route.ActionArgs & { params: Params }) {
  const jwt = getJwtFromRequest(request);
  if (!jwt) throw redirect('/login');

  const form = await request.formData();
  const actionType = form.get('_action');
  const documentId = String(form.get('_docId'));

  if (actionType === 'delete') {
    await deleteGrocery(documentId, jwt);
    return redirect('/groceries?message=Grocery item deleted successfully!');
  }
}

const GroceriesPage = ({ loaderData }: Route.ComponentProps) => {
  const [showDone, setShowDone] = useState(false);
  const { groceriesData } = loaderData;
  const { groceries, setGroceries } = useGrocery();
  useEffect(() => {
    setGroceries(groceriesData);
  }, [groceriesData, setGroceries]);

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');

  const toggleDone = (documentId: string) => {
    const updated = groceries?.map((item) =>
      item.documentId === documentId ? { ...item, done: !item.done } : item,
    );
    setGroceries(updated);
  };

  const activeItems = groceries?.filter((i) => !i.done);
  const doneItems = groceries?.filter((i) => i.done);

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
          <Form method='post'>
            {activeItems.map((item) => (
              <>
                <input type='hidden' name='_action' value='delete' />
                <input type='hidden' name='_docId' value={item.documentId} />
                <CheckListItem
                  key={item.documentId}
                  item={{
                    documentId: item.documentId,
                    label: item.name,
                    assignedTo: item.assignedTo,
                    quantity: item.quantity || undefined,
                    done: item.done,
                    priority: item.priority,
                  }}
                  onToggleDone={toggleDone}
                />
              </>
            ))}
          </Form>
        )}
      </div>

      {/* Completed Items */}
      <div className='mt-6'>
        <button
          onClick={() => setShowDone(!showDone)}
          className='w-full bg-gray-800 p-2 rounded-xs text-left flex justify-between items-center'
        >
          <span className='text-sm font-semibold'>Completed Items</span>
          <span>{showDone ? '▲' : '▼'}</span>
        </button>

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
                    documentId: item.documentId,
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
