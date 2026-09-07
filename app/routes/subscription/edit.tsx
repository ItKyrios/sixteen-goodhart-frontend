import type { Subscription } from '~/types';
import { useParams, Navigate, Link } from 'react-router';
import { useState } from 'react';
import useSubscriptions from '~/hooks/useSubscriptions';
import { generateId } from '~/utills/uuid';

const SubscriptionEditPage = () => {
  const { id } = useParams();
  const { subscriptions, updateSubscriptions } = useSubscriptions();

  const existing = subscriptions.find((s) => s.id === id);
  const [form, setForm] = useState<Subscription>(
    existing || {
      id: generateId(),
      name: '',
      amount: 0,
      cycle: 'monthly',
      lastRenewed: '',
      nextRenewal: '',
      paymentMethod: 'direct-debit',
      status: 'active',
      notes: '',
    },
  );

  const [saved, setSaved] = useState({ state: false, message: '' });

  const save = () => {
    let updated: Subscription[];
    if (existing) {
      updated = subscriptions.map((s) => (s.id === id ? form : s));
    } else {
      updated = [...subscriptions, form];
    }
    updateSubscriptions(updated);
    setSaved({ state: true, message: 'Subscription saved successfully' });
  };

  if (saved.state) {
    return (
      <Navigate to='/subscription' state={{ message: saved.message }} replace />
    );
  }

  const handleChange = <K extends keyof Subscription>(
    key: K,
    value: Subscription[K],
  ) => {
    setForm({ ...form, [key]: value });
  };

  const deleteItem = (id: string) => {
    const updated = subscriptions.filter((i) => i.id !== id);
    updateSubscriptions(updated);
    setSaved({ state: true, message: 'Subscription deleted successfully!' });
  };

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>
          {existing ? 'Edit Subscription' : 'Add Subscription'}
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
          <label htmlFor='cycle'>Cycle:</label>
          <select
            name='cycle'
            id='cycle'
            value={form.cycle}
            onChange={(e) =>
              handleChange(
                'cycle',
                e.target.value as 'weekly' | 'monthly' | 'yearly',
              )
            }
            className='px-2 bg-gray-200 text-gray-900'
          >
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
            <option value='yearly'>Yearly</option>
          </select>
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='lastRenewed'>Last Renewed:</label>
          <input
            type='date'
            name='lastRenewed'
            id='lastRenewed'
            value={form.lastRenewed}
            onChange={(e) => handleChange('lastRenewed', e.target.value)}
            className='px-2 bg-gray-200 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='nextRenewal'>Next Renewal:</label>
          <input
            type='date'
            name='nextRenewal'
            id='nextRenewal'
            value={form.nextRenewal}
            onChange={(e) => handleChange('nextRenewal', e.target.value)}
            className='px-2 bg-gray-200 text-gray-900'
          />
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='paymentMethod'>Payment Method:</label>
          <select
            name='paymentMethod'
            id='paymentMethod'
            value={form.paymentMethod}
            onChange={(e) =>
              handleChange(
                'paymentMethod',
                e.target.value as 'wise' | 'direct-debit' | 'cash' | 'other',
              )
            }
            className='px-2 bg-gray-200 text-gray-900'
          >
            <option value='wise'>Wise</option>
            <option value='direct-debit'>Direct Debit</option>
            <option value='cash'>Cash</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div className='grid grid-cols-2'>
          <label htmlFor='status'>Status:</label>
          <select
            name='status'
            id='status'
            value={form.status}
            onChange={(e) =>
              handleChange('status', e.target.value as 'active' | 'inactive')
            }
            className='px-2 bg-gray-200 text-gray-900'
          >
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
          </select>
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
        <div className='flex gap-4 text-center justify-between'>
          <button
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
            onClick={save}
          >
            Save
          </button>
          <Link
            to='/subscription'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionEditPage;
