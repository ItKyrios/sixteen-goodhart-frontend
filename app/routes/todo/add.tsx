import type { Route } from './+types';
import { Form, Link, redirect } from 'react-router';
import { createTodo } from '~/services/todo.server';
import TodoForm from '~/components/todo/TodoForm';

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  const newItem = {
    name: String(form.get('name')),
    assignedTo: String(form.get('assignedTo')),
    category: String(form.get('category')),
    dueDate: String(form.get('dueDate')),
    priority: String(form.get('priority')),
    done: form.get('done') === 'on',
  };

  await createTodo(newItem);
  return redirect('/todo?message=Todo item added successfully!');
}

const TodoAddPage = () => {
  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Add Todo Item</h1>

      <Form method='post' className='flex flex-col gap-3'>
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
      </Form>
    </div>
  );
};

export default TodoAddPage;
