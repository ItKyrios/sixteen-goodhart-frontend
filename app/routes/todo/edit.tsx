import type { Route } from './+types';
import { Link, redirect, useFetcher, useParams, Navigate } from 'react-router';
import { deleteTodo, updateTodo } from '~/services/todo.server';
import TodoForm from '~/components/todo/TodoForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { useAppContext } from '~/context/AppContext';
import { useEffect, useState } from 'react';

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
  params,
}: Route.ActionArgs & { params: Params }) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const { documentId } = params;
  const form = await request.formData();
  const actionType = form.get('_action');

  if (actionType === 'delete') {
    // Background delete
    deleteTodo(documentId, jwt).catch((err) => console.error(err));
    return { ok: true, deleted: true };
  }

  const updated = {
    name: String(form.get('name')),
    assignedTo: String(form.get('assignedTo')),
    category: String(form.get('category')),
    dueDate: String(form.get('dueDate')),
    priority: String(form.get('priority')),
    done: Boolean(form.get('done')),
  };

  // Background update
  updateTodo(documentId, updated, jwt).catch((err) => console.error(err));
  return { ok: true, updated };
}

const TodoEditPage = () => {
  const fetcher = useFetcher();
  const { documentId } = useParams();
  const { appState, setAppState } = useAppContext();
  const [redirectToList, setRedirectToList] = useState<string | null>(null);

  const todo = appState.todo.find((e) => e.documentId === documentId);

  useEffect(() => {
    // Update AppContext immediately when the fetcher completes
    if (fetcher.data?.updated) {
      const partial = fetcher.data.updated;

      setAppState((prev) => ({
        ...prev,
        todo: prev.todo.map((item) =>
          item.documentId === documentId ? { ...item, ...partial } : item,
        ),
      }));

      setRedirectToList('/todo?message=Todo item updated successfully!');
    }

    // Delete from AppContext
    if (fetcher.data?.deleted) {
      setAppState((prev) => ({
        ...prev,
        todo: prev.todo.filter((item) => item.documentId !== documentId),
      }));

      setRedirectToList('/todo?message=Todo item deleted successfully!');
    }
  }, [fetcher.data]);

  if (redirectToList) {
    return <Navigate to={redirectToList} replace />;
  }

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>Edit Todo Item</h1>

        <fetcher.Form method='post' className='ml-auto'>
          <input type='hidden' name='_action' value='delete' />
          <button
            type='submit'
            className='bg-red-600 px-8 py-2 mb-2 rounded-full hover:bg-red-700 active:scale-95 transition-transform cursor-pointer'
          >
            Delete
          </button>
        </fetcher.Form>
      </div>

      <fetcher.Form method='post' className='flex flex-col gap-3'>
        <TodoForm todo={todo} />

        <label className='flex item-center gap-3'>
          <input
            type='checkbox'
            name='done'
            id='done'
            defaultChecked={todo?.done ?? false}
          />
          Mark as done
        </label>

        <div className='flex gap-4 text-center justify-between'>
          <button
            type='submit'
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/todo'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </fetcher.Form>
    </div>
  );
};

export default TodoEditPage;
