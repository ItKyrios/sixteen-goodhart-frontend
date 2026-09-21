import type { Route } from './+types';
import { Form, Link, redirect } from 'react-router';
import { createWarranty } from '~/services/warranty.server';
import WarrantyForm from '~/components/warranty/WarrantyForm';

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();

  const newItem = {
    name: String(form.get('name')),
    model: String(form.get('model')),
    amount: Number(form.get('amount')),
    purchaseDate: String(form.get('purchaseDate')),
    warrantyEnd: String(form.get('warrantyEnd')),
    notes: String(form.get('notes')),
  };

  await createWarranty(newItem);
  return redirect('/warranty?message=Warranty item added successfully!');
}

const WarrantyAddPage = () => {
  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Add Warranty Item</h1>

      <Form method='post' className='flex flex-col gap-3'>
        <WarrantyForm />
        <div className='flex gap-4 text-center justify-between'>
          <button
            type='submit'
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/warranty'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default WarrantyAddPage;
