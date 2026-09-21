import type { Route } from './+types';
import type { ExpiryItem } from '~/types';
import { Link, Form, redirect } from 'react-router';
import { getExpiryByDocumentId, updateExpiry } from '~/services/expiry.server';
import ExpiryForm from '~/components/expiry/ExpiryForm';

type Params = { documentId: string };

export async function loader({
  params,
}: Route.LoaderArgs & { params: Params }): Promise<{ expiry: ExpiryItem }> {
  const { documentId } = params;
  const expiry = await getExpiryByDocumentId(documentId);
  if (!expiry) throw new Response('Expiry item not found', { status: 404 });
  return { expiry };
}

export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const { documentId } = params;
  const form = await request.formData();

  const updated = {
    name: String(form.get('name')),
    model: String(form.get('model')),
    amount: Number(form.get('amount')),
    purchaseDate: String(form.get('purchaseDate')),
    expiryDate: String(form.get('expiryDate')),
    notes: String(form.get('notes')),
  };

  await updateExpiry(documentId, updated);
  return redirect('/expiry?message=Expiry item updated successfully!');
}

const ExpiryEditPage = ({
  loaderData,
}: {
  loaderData: { expiry: ExpiryItem };
}) => {
  const { expiry } = loaderData;

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>Edit Expiry</h1>
        <button className='ml-auto bg-red-600 px-8 py-2 mb-2 rounded-full hover:bg-red-700 active:scale-95 transition-transform cursor-pointer'>
          Delete
        </button>
      </div>

      <Form method='post' className='flex flex-col gap-3'>
        <ExpiryForm expiryItem={expiry} />

        <div className='flex gap-4 text-center justify-between'>
          <button
            type='submit'
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/expiry'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ExpiryEditPage;
