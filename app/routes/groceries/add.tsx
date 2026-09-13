import type { Route } from './+types';
import { Form, Link, redirect } from 'react-router';
import { createGrocery } from '~/services/grocery.server';
import GroceryForm from '~/components/grocery/GroceryForm';

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  const newItem = {
    name: String(form.get('name')),
    quantity: Number(form.get('quantity')),
    assignedTo: String(form.get('assginedTo')),
    category: String(form.get('category')),
    priority: String(form.get('priority')),
    done: form.get('done') === 'on',
  };

  await createGrocery(newItem);
  return redirect('/groceries?message=Grocery item added successfully!');
}

const GroceryAddPage = () => {
  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Add Grocery Item</h1>
      <Form method='post' className='flex flex-col gap-3'>
        <GroceryForm />

        <div className='flex gap-4 text-center justify-between'>
          <button
            type='submit'
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/groceries'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default GroceryAddPage;
