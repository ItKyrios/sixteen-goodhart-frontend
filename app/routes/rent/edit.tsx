import type { Route } from './+types';
import type { StrapiRent } from '~/types';
import { Form, Link, redirect } from 'react-router';
import RentForm from '~/components/rent/RentForm';
import { getRentByDocumentId, updateRent } from '~/services/rent.server';

// Route params for manual routing
type Params = {
  documentId: string;
};

// Loader return type
type LoaderData = {
  rentData: StrapiRent;
};

// Loader: Fetch rent by documentId
export async function loader({
  params,
}: Route.LoaderArgs & { params: Params }): Promise<LoaderData> {
  const rentData = await getRentByDocumentId(params.documentId);
  return { rentData };
}

// Action: Update rent in Strapi
export async function action({
  request,
  params,
}: Route.ActionArgs & { params: Params }) {
  const { documentId } = params;
  const form = await request.formData();

  const updatedRent = {
    amount: Number(form.get('amount')),
    lastPaidDate: String(form.get('lastPaidDate')),
    nextDueDate: String(form.get('nextDueDate')),
    paymentMethod: String(form.get('paymentMethod')),
    notes: String(form.get('notes')),
  };

  await updateRent(documentId, updatedRent);
  return redirect(`/rent?message=Rent updated successfully!`);
}

const RentEditPage = ({ loaderData }: { loaderData: LoaderData }) => {
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
