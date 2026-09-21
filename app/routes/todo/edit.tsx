import type { Route } from './+types';
import type { TodoItem } from '~/types';
import { Link, Form, redirect } from 'react-router';
import { getTodoByDocumentId, updateTodo } from '~/services/todo.server';
import TodoForm from '~/components/todo/TodoForm';

type Params = { documentId: string };

export async function loader({
  params,
}: Route.LoaderArgs & { params: Params }): Promise<{ todo: TodoItem }> {
  const { documentId } = params;
  const todo = await getTodoByDocumentId(documentId);
  if (!todo) throw new Response('Todo not found', { status: 404 });
  return { todo };
}

export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const { documentId } = params;
  const form = await request.formData();

  const updated = {
    name: String(form.get('name')),
    assignedTo: String(form.get('assignedTo')),
    category: String(form.get('category')),
    dueDate: String(form.get('dueDate')),
    priority: String(form.get('priority')),
    done: form.get('done') === 'on',
  };

  await updateTodo(documentId, updated);
  return redirect('/todo?message=Todo item updated successfully!');
}

const TodoEditPage = ({ loaderData }: { loaderData: { todo: TodoItem } }) => {
  const { todo } = loaderData;

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Edit Todo Item</h1>

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
