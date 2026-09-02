import type { Warranty } from '~/types';
import { useParams, Navigate, Link } from 'react-router';
import { useState } from 'react';
import useWarranty from '~/hooks/useWarranty';
import { generateId } from '~/utills/uuid';

const WarrantyEditPage = () => {
  const { id } = useParams();
  const { warranty, updateWarranty } = useWarranty();

  const existing = warranty.find((w) => w.id === id);

  const [form, setForm] = useState<Warranty>(
    existing || {
      id: generateId(),
      name: '',
      model: '',
      amount: 0,
      purchaseDate: '',
      expiryDate: '',
      warrantyEnd: '',
      notes: '',
      photoUrl: '',
    },
  );

  const [saved, setSaved] = useState(false);
  const save = () => {
    let updated: Warranty[];
    if (existing) {
      updated = warranty.map((w) => (w.id === id ? form : w));
    } else {
      updated = [...warranty, form];
    }
    updateWarranty(updated);
    setSaved(true);
  };
  if (saved) {
    return (
      <Navigate
        to='/warranty'
        state={{ message: 'Warranty saved successfully!' }}
        replace
      />
    );
  }

  const handleChange = <K extends keyof Warranty>(
    key: K,
    value: Warranty[K],
  ) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>
        {existing ? 'Edit Warranty' : 'Add Warranty'}
      </h1>

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
        <div className='grid grid-cols-2'>
          <label htmlFor='amount'>Amount:</label>
          <input
            type='number'
            name='amount'
            id='amount'
            value={form.amount}
            onChange={(e) => handleChange('amount', Number(e.target.value))}
            className='px-2 bg-gray-200 text-gray-900'
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
          <label htmlFor='warrantyEnd'>Warranty End:</label>
          <input
            type='date'
            name='warrantyEnd'
            id='warrantyEnd'
            value={form.warrantyEnd}
            onChange={(e) => handleChange('warrantyEnd', e.target.value)}
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
            to='/warranty'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WarrantyEditPage;
