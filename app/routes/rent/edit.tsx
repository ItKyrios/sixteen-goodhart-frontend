import type { Route } from './+types';
import type { StrapiRent } from '~/types';
import { Form, redirect } from 'react-router';
import RentForm from '~/components/rent/RentForm';
import { getRentByDocumentId, updateRent } from '~/services/rent.server';
import { getJwtFromRequest, isJwtExpired } from '~/utills/cookies';

// Route params for manual routing
type Params = {
  documentId: string;
};

// Loader: Fetch rent by documentId
export async function loader({
  params,
  request,
}: Route.LoaderArgs & { params: Params }): Promise<{ rentData: StrapiRent }> {
  const jwt = getJwtFromRequest(request);
  if (isJwtExpired(jwt)) throw redirect('/login');

  const { documentId } = params;
  const rentData = await getRentByDocumentId(documentId, jwt);
  if (!rentData) throw new Response('Rent item not found', { status: 404 });
  return { rentData };
}

// Action: Update rent in Strapi
export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const jwt = getJwtFromRequest(request);
  if (!jwt) throw redirect('/login');

  const { documentId } = params;
  const form = await request.formData();

  const updatedRent = {
    amount: Number(form.get('amount')),
    lastPaidDate: String(form.get('lastPaidDate')),
    nextDueDate: String(form.get('nextDueDate')),
    paymentMethod: String(form.get('paymentMethod')),
    notes: String(form.get('notes')),
  };

  await updateRent(documentId, updatedRent, jwt);
  return redirect(`/rent?message=Rent updated successfully!`);
}

const RentEditPage = ({
  loaderData,
}: {
  loaderData: { rentData: StrapiRent };
}) => {
  const { rentData } = loaderData;

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Edit Rent</h1>

      <Form
        method='post'
        className='flex flex-col gap-3 bg-gray-900 p-4 rounded-xs shadow-md-mb-4'
      >
        {/* Component: Edit Rent Form */}
        <RentForm rentData={rentData} />
      </Form>
    </div>
  );
};

export default RentEditPage;
