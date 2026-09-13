import type { Route } from './+types';
import type { GroceryItem } from '~/types';
import { Link, Form, redirect } from 'react-router';
import {
  getGroceryByDocumentId,
  updateGrocery,
} from '~/services/grocery.server';
import GroceryForm from '~/components/grocery/GroceryForm';

type Params = { documentId: string };

export async function loader({
  params,
}: Route.LoaderArgs & { params: Params }): Promise<{
  grocery: GroceryItem;
}> {
  const { documentId } = params;
  const grocery = await getGroceryByDocumentId(documentId);
  if (!grocery) throw new Response('Grocery not found', { status: 404 });
  return { grocery };
}

export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const { documentId } = params;
  const form = await request.formData();

  const updated = {
    name: String(form.get('name')),
    quantity: Number(form.get('quantity')),
    assignedTo: String(form.get('assginedTo')),
    category: String(form.get('category')),
    priority: String(form.get('priority')),
    done: form.get('done') === 'on',
  };

  await updateGrocery(documentId, updated);
  return redirect('/groceries?message=Grocery item updated successfully!');
}

const GroceryEditPage = ({
  loaderData,
}: {
  loaderData: { grocery: GroceryItem };
}) => {
  const { grocery } = loaderData;

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Edit Grocery Item</h1>

      <Form method='post' className='flex flex-col gap-3'>
        <GroceryForm grocery={grocery} />

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

export default GroceryEditPage;
