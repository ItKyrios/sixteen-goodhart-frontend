import type { Route } from './+types';
import { Link, redirect, useFetcher, useLocation } from 'react-router';
import Message from '~/components/Message';
import { useState, useEffect } from 'react';
import CheckListItem from '~/components/CheckListItem';
import DoneCheckListItem from '~/components/DoneCheckListItem';
import type { CheckListItemBase } from '~/types';
import { deleteTodo, updateTodo } from '~/services/todo.server';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { useAppContext } from '~/context/AppContext';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Todos' },
    { name: 'description', content: 'A web app for home' },
  ];
}

// Route params for manual routing
type Params = { documentId: string };

// Loader: ONLY checks if the user is logged in, else redirect, return null.
export async function loader({ request }: Route.LoaderArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');
  return null;
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
    updateTodo(documentId, { done }, jwt).catch((err) => console.error(err));
    return { ok: true, toggle: { documentId, done } };
  }

  if (actionType === 'delete') {
    // Background delete
    deleteTodo(documentId, jwt).catch((err) => console.error(err));
    return { ok: true, deleted: documentId };
  }

  return null;
}

const TodoPage = () => {
  const fetcher = useFetcher();
  const [showDone, setShowDone] = useState(false);
  const { appState, setAppState } = useAppContext();

  const todos = appState.todo;

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');

  const toggleDone = (item: CheckListItemBase) => {
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
      todo: prev.todo.map((t) =>
        t.documentId === item.documentId ? { ...t, done: !item.done } : t,
      ),
    }));
  };

  const deleteItem = (documentId: string) => {
    fetcher.submit(
      { _action: 'delete', documentId: String(documentId) },
      { method: 'post' },
    );

    // Optimistic delete
    setAppState((prev) => ({
      ...prev,
      todo: prev.todo.filter((t) => t.documentId !== documentId),
    }));
  };

  const activeItems = todos?.filter((i) => !i.done);
  const doneItems = todos?.filter((i) => i.done);

  // Apply optimistic updates
  useEffect(() => {
    if (fetcher.data?.toggle) {
      const { documentId, done } = fetcher.data.toggle;

      setAppState((prev) => ({
        ...prev,
        todo: prev.todo.map((item) =>
          item.documentId === documentId ? { ...item, done } : item,
        ),
      }));
    }

    if (fetcher.data?.deleted) {
      const documentId = fetcher.data.deleted;

      setAppState((prev) => ({
        ...prev,
        todo: prev.todo.filter((item) => item.documentId !== documentId),
      }));
    }
  }, [fetcher.data]);

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2'>
        <h1 className='text-3xl font-bold text-white mb-2'>Todo</h1>
        <Link
          to='/todo/new'
          className='ml-auto bg-green-600 px-8 py-2 mb-2 rounded-full hover:bg-green-700 active:scale-95 transition-transform cursor-pointer'
        >
          Add
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {!activeItems || activeItems.length === 0 ? (
          <p className='p-2 rounded-xs text-xs flex items-center gap-2 opacity-70'>
            Your todo list is empty
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
                    dueDate: item.dueDate,
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

      {/* Completed Section */}
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
            {!doneItems || doneItems.length === 0 ? (
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

export default TodoPage;
