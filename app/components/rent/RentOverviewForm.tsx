import type { Rent } from '~/types';
import { Link } from 'react-router';

const RentOverviewForm = ({
  rentData,
  daysLeft,
}: {
  rentData: Rent;
  daysLeft: number;
}) => {
  return (
    <div className='bg-gray-900 p-4 rounded-xs shadow-md-mb-4'>
      <div className='mb-2'>
        <span className='opacity-80'>Amount:</span>
        <div className='text-xl font-medium'>${rentData.amount}</div>
      </div>

      <div className='mb-2'>
        <span className='opacity-80'>Last Paid:</span>
        <div>{rentData.lastPaidDate}</div>
      </div>

      <div className='mb-2'>
        <span className='opacity-80'>Next Due:</span>
        <div>{rentData.nextDueDate}</div>
      </div>

      <div className='mb-2'>
        <span className='opacity-80'>Days Left:</span>
        <div>{daysLeft}</div>
      </div>

      <div className='mb-2'>
        <span className='opacity-80'>Last Payment Method:</span>
        <div>{rentData.paymentMethod}</div>
      </div>

      <div className='mb-2'>
        <span className='opacity-80'>Notes:</span>
        <div>{rentData.notes}</div>
      </div>

      <Link to={`/rent/edit/${rentData.documentId}`}>
        <button className='bg-blue-600 p-3 rounded-xs w-full active:scale-95 transition-transform cursor-pointer'>
          Edit Rent Details
        </button>
      </Link>
    </div>
  );
};

export default RentOverviewForm;
