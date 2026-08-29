import { useState } from 'react';
import { Link } from 'react-router';
import useRent from '~/hooks/useRent';
import { Navigate } from 'react-router';

const RentEditPage = () => {
  const { rent, updateRent } = useRent();
  const [form, setForm] = useState(rent);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };
  const save = () => {
    updateRent(form);
    setSaved(true);
  };
  if (saved) {
    return (
      <Navigate
        to='/rent'
        state={{ message: 'Rent updated successfully!' }}
        replace
      />
    );
  }

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>Edit Rent</h1>

      <div className='flex flex-col gap-3 bg-gray-900 p-4 rounded-xs shadow-md-mb-4'>
        <div className='grid grid-cols-2 justify-between'>
          <label htmlFor='amount'>Amount:</label>
          <input
            type='number'
            name='amount'
            id='amount'
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className='bg-gray-400 px-4 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2 justify-between'>
          <label htmlFor='lastPaidDate'>Last Paid:</label>
          <input
            type='date'
            name='lastPaidDate'
            id='lastPaidDate'
            value={form.lastPaidDate}
            onChange={(e) => handleChange('lastPaidDate', e.target.value)}
            className='bg-gray-400 px-4 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2 justify-between'>
          <label htmlFor='nextDueDate'>Next Due:</label>
          <input
            type='date'
            name='nextDueDate'
            id='nextDueDate'
            value={form.nextDueDate}
            onChange={(e) => handleChange('nextDueDate', e.target.value)}
            className='bg-gray-400 px-4 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2 justify-between'>
          <label htmlFor='paymentMethod'>Payment Method:</label>
          <input
            type='text'
            name='paymentMethod'
            id='paymentMethod'
            value={form.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value)}
            className='bg-gray-400 px-4 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2 justify-between'>
          <label htmlFor='notes'>Notes:</label>
          <textarea
            name='notes'
            id='notes'
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className='bg-gray-400 px-4 text-gray-900'
          />
        </div>
        <div className='flex gap-4 text-center justify-between'>
          <button
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
            onClick={save}
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
      </div>
    </div>
  );
};

export default RentEditPage;
