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

  const [saved, setSaved] = useState(false);

  const save = () => {
    let updated: Subscription[];
    if (existing) {
      updated = subscriptions.map((s) => (s.id === id ? form : s));
    } else {
      updated = [...subscriptions, form];
    }
    updateSubscriptions(updated);
    setSaved(true);
  };

  if (saved) {
    return (
      <Navigate
        to='/subscription'
        state={{ message: 'Subscriptions saved successfully!' }}
        replace
      />
    );
  }

  const handleChange = <K extends keyof Subscription>(
    key: K,
    value: Subscription[K],
  ) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>
        {existing ? 'Edit Subscription' : 'Add Subscription'}
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
          <label htmlFor='amount'>Amount ($):</label>
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
