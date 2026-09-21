import type { ExpiryItem } from '~/types';

type Props = {
  expiryItem?: ExpiryItem; // optional for new item
};

const ExpiryForm = ({ expiryItem: expiry }: Props) => {
  return (
    <>
      <div className='grid grid-cols-2'>
        <label htmlFor='name'>Name:</label>
        <input
          type='text'
          name='name'
          id='name'
          defaultValue={expiry?.name ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='model'>Model:</label>
        <input
          type='text'
          name='model'
          id='model'
          defaultValue={expiry?.model ?? ''}
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
          defaultValue={expiry?.amount ?? 0}
          className='px-2 col-span-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='purchaseDate'>Purchase Date:</label>
        <input
          type='date'
          name='purchaseDate'
          id='purchaseDate'
          defaultValue={expiry?.purchaseDate ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='expiryDate'>Expiry Date:</label>
        <input
          type='date'
          name='expiryDate'
          id='expiryDate'
          defaultValue={expiry?.expiryDate ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='notes'>Notes:</label>
        <textarea
          name='notes'
          id='notes'
          defaultValue={expiry?.notes ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='photoUrl'>Photo Url:</label>
        <input
          type='text'
          name='photoUrl'
          id='photoUrl'
          defaultValue={expiry?.media?.url ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
    </>
  );
};

export default ExpiryForm;
