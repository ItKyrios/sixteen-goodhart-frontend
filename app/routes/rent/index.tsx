import useRent from '~/hooks/useRent';
import { Link } from 'react-router';
import { useLocation } from 'react-router';

const RentPage = () => {
  const { rent, daysLeft } = useRent();
  const location = useLocation();
  const message = location.state?.message;
  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Rent Overview</h1>
      {message && (
        <div className='bg-green-600 rounded-xs p-3 mb-4'>{message}</div>
      )}

      <div className='bg-gray-900 p-4 rounded-xs shadow-md-mb-4'>
        <div className='mb-2'>
          <span className='opacity-80'>Amount:</span>
          <div className='text-xl font-medium'>${rent.amount}</div>
        </div>

        <div className='mb-2'>
          <span className='opacity-80'>Last Paid:</span>
          <div>{rent.lastPaidDate}</div>
        </div>

        <div className='mb-2'>
          <span className='opacity-80'>Next Due:</span>
          <div>{rent.nextDueDate}</div>
        </div>

        <div className='mb-2'>
          <span className='opacity-80'>Days Left:</span>
          <div>{daysLeft}</div>
        </div>

        <div className='mb-2'>
          <span className='opacity-80'>Last Payment Method:</span>
          <div>{rent.paymentMethod}</div>
        </div>

        <div className='mb-2'>
          <span className='opacity-80'>Notes:</span>
          <div>{rent.notes}</div>
        </div>

        <Link to='/rent/edit'>
          <button className='bg-blue-600 p-3 rounded-xs w-full active:scale-95 transition-transform cursor-pointer'>
            Edit Rent Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RentPage;
