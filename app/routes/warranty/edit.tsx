import type { Route } from './+types';
import type { Warranty } from '~/types';
import { Link, Form, redirect } from 'react-router';
import {
  getWarrantyByDocumentId,
  updateWarranty,
} from '~/services/warranty.server';
import WarrantyForm from '~/components/warranty/WarrantyForm';

type Params = { documentId: string };

export async function loader({
  params,
}: Route.LoaderArgs & { params: Params }): Promise<{ warranty: Warranty }> {
  const { documentId } = params;
  const warranty = await getWarrantyByDocumentId(documentId);
  if (!warranty) throw new Response('Waranty item not found', { status: 404 });
  return { warranty };
}

export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const { documentId } = params;
  const form = await request.formData();

  const udpated = {
    name: String(form.get('name')),
    model: String(form.get('model')),
    amount: Number(form.get('amount')),
    purchaseDate: String(form.get('purchaseDate')),
    warrantyEnd: String(form.get('warrantyEnd')),
    notes: String(form.get('notes')),
  };

  await updateWarranty(documentId, udpated);
  return redirect('/warranty?message=Warranty item updated successfully!');
}

const WarrantyEditPage = ({
  loaderData,
}: {
  loaderData: { warranty: Warranty };
}) => {
  const { warranty } = loaderData;

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>Edit Warranty</h1>

        <button className='ml-auto bg-red-600 px-8 py-2 mb-2 rounded-full hover:bg-red-700 active:scale-95 transition-transform cursor-pointer'>
          Delete
        </button>
      </div>

      <Form method='post' className='flex flex-col gap-3'>
        <WarrantyForm warrantyItem={warranty} />
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

export default WarrantyEditPage;
