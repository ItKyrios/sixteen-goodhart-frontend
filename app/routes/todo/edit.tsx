import type { Route } from './+types';
import type { TodoItem } from '~/types';
import { Link, Form, redirect } from 'react-router';
import {
  deleteTodo,
  getTodoByDocumentId,
  updateTodo,
} from '~/services/todo.server';
import TodoForm from '~/components/todo/TodoForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

// Route params for manual routing
type Params = { documentId: string };

// Loader: Fetch todo by documentId
export async function loader({
  params,
  request,
}: Route.LoaderArgs & { params: Params }): Promise<{ todo: TodoItem }> {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const { documentId } = params;
  const todo = await getTodoByDocumentId(documentId, jwt);
  if (!todo) throw new Response('Todo not found', { status: 404 });
  return { todo };
}

// Action: Update todo in Strapi
export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const jwt = getJwtFromRequest(request);

  const { documentId } = params;
  const form = await request.formData();
  const actionType = form.get('_action');

  if (actionType === 'delete') {
    await deleteTodo(documentId, jwt);
    return redirect('/todo?message=Grocery item deleted successfully!');
  }

  const updated = {
    name: String(form.get('name')),
    assignedTo: String(form.get('assignedTo')),
    category: String(form.get('category')),
    dueDate: String(form.get('dueDate')),
    priority: String(form.get('priority')),
    done: Boolean(form.get('done')),
  };

  await updateTodo(documentId, updated, jwt);
  return redirect('/todo?message=Todo item updated successfully!');
}

const TodoEditPage = ({ loaderData }: { loaderData: { todo: TodoItem } }) => {
  const { todo } = loaderData;

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>Edit Todo Item</h1>
        <Form method='post' className='ml-auto'>
          <input type='hidden' name='_action' value='delete' />
          <button
            type='submit'
            className='bg-red-600 px-8 py-2 mb-2 rounded-full hover:bg-red-700 active:scale-95 transition-transform cursor-pointer'
          >
            Delete
          </button>
        </Form>
      </div>

      <Form method='post' className='flex flex-col gap-3'>
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
      </Form>
    </div>
  );
};

export default TodoEditPage;
