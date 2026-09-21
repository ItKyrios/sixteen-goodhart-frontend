import type { Subscription } from '~/types';

type Props = {
  sub?: Subscription; //optional for new item
};

const SubscriptionForm = ({ sub }: Props) => {
  return (
    <>
      <div className='grid grid-cols-2'>
        <label htmlFor='name'>Name:</label>
        <input
          type='text'
          name='name'
          id='name'
          defaultValue={sub?.name ?? ''}
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
          defaultValue={sub?.amount ?? 0}
          className='px-2 col-span-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='cycle'>Cycle:</label>
        <select
          name='cycle'
          id='cycle'
          defaultValue={sub?.cycle ?? 'monthly'}
          className='px-2 bg-gray-200 text-gray-900'
        >
          <option value='daily'>Daily</option>
          <option value='fortnightly'>Fortnightly</option>
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
          defaultValue={sub?.lastRenewed ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='nextRenewal'>Next Renewal:</label>
        <input
          type='date'
          name='nextRenewal'
          id='nextRenewal'
          defaultValue={sub?.nextRenewal ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='paymentMethod'>Payment Method:</label>
        <select
          name='paymentMethod'
          id='paymentMethod'
          defaultValue={sub?.paymentMethod ?? 'direct-debit'}
          className='px-2 bg-gray-200 text-gray-900'
        >
          <option value='wise'>Wise</option>
          <option value='bank-transfer'>Bank Transfer</option>
          <option value='direct-debit'>Direct Debit</option>
          <option value='cash'>Cash</option>
          <option value='other'>Other</option>
        </select>
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='notes'>Notes:</label>
        <textarea
          name='notes'
          id='notes'
          defaultValue={sub?.notes ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>

      <label htmlFor='activeStatus' className='flex item-center gap-3'>
        <input
          type='checkbox'
          name='activeStatus'
          id='activeStatus'
          defaultChecked={sub?.activeStatus ?? false}
        />
        Mark as active
      </label>
    </>
  );
};

export default SubscriptionForm;
