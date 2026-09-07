import type { ExpiryItem } from '~/types';
import { useParams, Navigate, Link } from 'react-router';
import { useState } from 'react';
import useExpiry from '~/context/ExpiryContext';
import { generateId } from '~/utills/uuid';

const ExpiryEditPage = () => {
  const { id } = useParams();
  const { items, updateExpiry } = useExpiry();

  const existing = items.find((w) => w.id === id);

  const [form, setForm] = useState<ExpiryItem>(
    existing || {
      id: generateId(),
      name: '',
      model: '',
      amount: 0,
      purchaseDate: '',
      expiryDate: '',
      notes: '',
      photoUrl: '',
    },
  );

  const [saved, setSaved] = useState({ state: false, message: '' });

  const save = () => {
    let updated: ExpiryItem[];
    if (existing) {
      updated = items.map((w) => (w.id === id ? form : w));
    } else {
      updated = [...items, form];
    }
    updateExpiry(updated);
    setSaved({ state: true, message: 'Item expiry saved successfully' });
  };

  if (saved.state) {
    return <Navigate to='/expiry' state={{ message: saved.message }} replace />;
  }

  const handleChange = <K extends keyof ExpiryItem>(
    key: K,
    value: ExpiryItem[K],
  ) => {
    setForm({ ...form, [key]: value });
  };

  const deleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    updateExpiry(updated);
    setSaved({ state: true, message: 'Item deleted successfully!' });
  };

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>
          {existing ? 'Edit Expiry' : 'Add Expiry'}
        </h1>
        {existing && (
          <button
            onClick={() => deleteItem(existing.id)}
            className='ml-auto bg-red-600 px-8 py-2 mb-2 rounded-full hover:bg-red-700 active:scale-95 transition-transform cursor-pointer'
          >
            Delete
          </button>
        )}
      </div>

      <div className='flex flex-col gap-3'>
        <div className='grid grid-cols-2'>
          <label htmlFor='name'>Name:</label>
          <input
            type='text'
            name='name'
            id='name'
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className='px-2 bg-gray-200 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='model'>Model:</label>
          <input
            type='text'
            name='model'
            id='model'
            value={form.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className='px-2 bg-gray-200 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-4'>
          <label htmlFor='amount'>Amount:</label>
          <span className='ml-auto pr-2'>$</span>
          <input
            type='number'
            name='amount'
            id='amount'
            value={form.amount}
            onChange={(e) => handleChange('amount', Number(e.target.value))}
            className='px-2 col-span-2 bg-gray-200 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='purchaseDate'>Purchase Date:</label>
          <input
            type='date'
            name='purchaseDate'
            id='purchaseDate'
            value={form.purchaseDate}
            onChange={(e) => handleChange('purchaseDate', e.target.value)}
            className='px-2 bg-gray-200 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='expiryDate'>Expiry Date:</label>
          <input
            type='date'
            name='expiryDate'
            id='expiryDate'
            value={form.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            className='px-2 bg-gray-200 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='notes'>Notes:</label>
          <textarea
            name='notes'
            id='notes'
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className='px-2 bg-gray-200 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='photoUrl'>Photo Url:</label>
          <input
            type='text'
            name='photoUrl'
            id='photoUrl'
            value={form.photoUrl}
            onChange={(e) => handleChange('photoUrl', e.target.value)}
            className='px-2 bg-gray-200 text-gray-900'
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
            to='/expiry'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpiryEditPage;
