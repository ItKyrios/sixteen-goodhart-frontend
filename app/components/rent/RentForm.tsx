import { Link } from 'react-router';
import type { StrapiRent } from '~/types';

const RentForm = ({ rentData }: { rentData: StrapiRent }) => {
  return (
    <>
      <div className='grid grid-cols-4 justify-between'>
        <label htmlFor='amount'>Amount:</label>
        <span className='ml-auto pr-2'>$</span>
        <input
          type='number'
          name='amount'
          id='amount'
          defaultValue={rentData.amount}
          className='col-span-2 bg-gray-400 px-4 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2 justify-between'>
        <label htmlFor='lastPaidDate'>Last Paid:</label>
        <input
          type='date'
          name='lastPaidDate'
          id='lastPaidDate'
          defaultValue={rentData.lastPaidDate}
          className='bg-gray-400 px-4 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2 justify-between'>
        <label htmlFor='nextDueDate'>Next Due:</label>
        <input
          type='date'
          name='nextDueDate'
          id='nextDueDate'
          defaultValue={rentData.nextDueDate}
          className='bg-gray-400 px-4 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2 justify-between'>
        <label htmlFor='paymentMethod'>Payment Method:</label>
        <select
          name='paymentMethod'
          id='paymentMethod'
          defaultValue={rentData.paymentMethod}
          className='bg-gray-400 px-4 text-gray-900'
        >
          <option value='cash'>Cash</option>
          <option value='payid'>PayID</option>
          <option value='bank-transfer'>Bank Transfer</option>
          <option value='wise'>Wise</option>
          <option value='direct-debit'>Direct Debit</option>
          <option value='other'>Other</option>
        </select>
      </div>
      <div className='grid grid-cols-2 justify-between'>
        <label htmlFor='notes'>Notes:</label>
        <textarea
          name='notes'
          id='notes'
          defaultValue={rentData.notes}
          className='bg-gray-400 px-4 text-gray-900'
        />
      </div>
      <div className='flex gap-4 text-center justify-between'>
        <button
          type='submit'
          className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
        >
          Save
        </button>
        <Link
          to='/rent'
          className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
        >
          Cancel
        </Link>
      </div>
    </>
  );
};

export default RentForm;
