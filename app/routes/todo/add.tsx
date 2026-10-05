import type { Route } from './+types';
import { Link, Navigate, redirect, useFetcher } from 'react-router';
import { createTodo } from '~/services/todo.server';
import TodoForm from '~/components/todo/TodoForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';
import { useAppContext } from '~/context/AppContext';
import { useEffect, useState } from 'react';

export async function action({ request }: Route.ActionArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const form = await request.formData();

  const newItem = {
    name: String(form.get('name')),
    assignedTo: String(form.get('assignedTo')),
    category: String(form.get('category')),
    dueDate: String(form.get('dueDate')),
    priority: String(form.get('priority')),
    done: Boolean(form.get('done')),
  };

  // Background create
  createTodo(newItem, jwt).catch((err) => console.error(err));
  return { ok: true, created: newItem };
}

const TodoAddPage = () => {
  const fetcher = useFetcher();
  const { setAppState } = useAppContext();
  const [redirectToList, setRedirectToList] = useState<string | null>(null);

  useEffect(() => {
    if (fetcher.data?.created) {
      const tempId = `temp-${Date.now()}`;

      const newItem = {
        documentId: tempId,
        id: tempId,
        ...fetcher.data.created,
      };

      // Update AppContext immediately
      setAppState((prev) => ({
        ...prev,
        todo: [...prev.todo, newItem],
      }));

      // Redirect instantly
      setRedirectToList('/todo?message=Todo item added successfully!');
    }
  }, [fetcher.data]);

  if (redirectToList) {
    return <Navigate to={redirectToList} replace />;
  }

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Add Todo Item</h1>

      <fetcher.Form method='post' className='flex flex-col gap-3'>
        <TodoForm />

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

export default TodoAddPage;
