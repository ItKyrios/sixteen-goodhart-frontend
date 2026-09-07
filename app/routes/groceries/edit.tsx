import type { GroceryItem } from '~/types';
import { useParams, Navigate } from 'react-router';
import { useState } from 'react';
import useGrocery from '~/context/GroceryContext';
import { generateId } from '~/utills/uuid';

const GroceryEditPage = () => {
  const { id } = useParams();
  const { items, updateGrocery } = useGrocery();

  const existing = items.find((i) => i.id === id);

  const [form, setForm] = useState<GroceryItem>(
    existing || {
      id: generateId(),
      name: '',
      quantity: 0,
      assignedTo: '',
      createdBy: 'loggedinUser',
      category: '',
      priority: 'low',
      done: false,
    },
  );

  const [saved, setSaved] = useState(false);
  const save = () => {
    let updated: GroceryItem[];

    if (existing) {
      updated = items.map((i) => (i.id === id ? form : i));
    } else {
      updated = [...items, form];
    }
    updateGrocery(updated);
    setSaved(true);
  };

  if (saved) {
    return (
      <Navigate
        to='/groceries'
        state={{ message: 'Grocery item saved!' }}
        replace
      />
    );
  }

  const handleChange = <K extends keyof GroceryItem>(
    key: K,
    value: GroceryItem[K],
  ) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>
        {existing ? 'Edit Grocery Item' : 'Add Grocery Item'}
      </h1>

      <div className='flex flex-col gap-3'>
        <label htmlFor='name'>Item Name:</label>
        <input
          type='text'
          name='name'
          id='name'
          value={form.name}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) => handleChange('name', e.target.value)}
        />

        <label htmlFor='quantity'>Item Qty:</label>
        <input
          type='number'
          name='quantity'
          id='quantity'
          value={form.quantity}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) => handleChange('quantity', Number(e.target.value))}
        />

        <label htmlFor='assignedTo'>Assigned To:</label>
        <input
          type='text'
          name='assignedTo'
          id='assignedTo'
          value={form.assignedTo}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) => handleChange('assignedTo', e.target.value)}
        />

        <label htmlFor='category'>Category:</label>
        <input
          type='text'
          name='category'
          id='category'
          value={form.category}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) => handleChange('category', e.target.value)}
        />

        <label htmlFor='priority'>Priority:</label>
        <select
          name='priority'
          id='priority'
          value={form.priority}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) =>
            handleChange(
              'priority',
              e.target.value as 'low' | 'medium' | 'high',
            )
          }
        >
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>High</option>
        </select>

        <label className='flex item-center gap-3'>
          <input
            type='checkbox'
            name='done'
            id='done'
            checked={form.done}
            onChange={(e) => handleChange('done', e.target.checked)}
          />
          Mark as done
        </label>

        <button
          onClick={save}
          className='bg-green-600 p-3 rounded-xs cursor-pointer'
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default GroceryEditPage;
