import type { Route } from './+types';
import { Form, Link, redirect } from 'react-router';
import { createExpiry } from '~/services/expiry.server';
import ExpiryForm from '~/components/expiry/ExpiryForm';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

export async function action({ request }: Route.ActionArgs) {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const form = await request.formData();

  const newItem = {
    name: String(form.get('name')),
    model: String(form.get('model')),
    amount: Number(form.get('amount')),
    purchaseDate: String(form.get('purchaseDate')),
    expiryDate: String(form.get('expiryDate')),
    notes: String(form.get('notes')),
  };

  await createExpiry(newItem, jwt);
  return redirect('/expiry?message=Expiry item added successfully!&refresh=1');
}

const ExpiryAddPage = () => {
  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Add Expiry Item</h1>

      <Form method='post' className='flex flex-col gap-3'>
        <ExpiryForm />

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

export default ExpiryAddPage;
