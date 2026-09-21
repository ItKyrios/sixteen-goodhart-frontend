import type { Warranty } from '~/types';

type Props = {
  warrantyItem?: Warranty; //optional for new item
};

const WarrantyForm = ({ warrantyItem: w }: Props) => {
  return (
    <>
      <div className='grid grid-cols-2'>
        <label htmlFor='name'>Name:</label>
        <input
          type='text'
          name='name'
          id='name'
          defaultValue={w?.name ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='model'>Model:</label>
        <input
          type='text'
          name='model'
          id='model'
          defaultValue={w?.model ?? ''}
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
          defaultValue={w?.amount ?? 0}
          className='px-2 col-span-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='purchaseDate'>Purchase Date:</label>
        <input
          type='date'
          name='purchaseDate'
          id='purchaseDate'
          defaultValue={w?.purchaseDate ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='warrantyEnd'>Warranty End:</label>
        <input
          type='date'
          name='warrantyEnd'
          id='warrantyEnd'
          defaultValue={w?.warrantyEnd ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='notes'>Notes:</label>
        <textarea
          name='notes'
          id='notes'
          defaultValue={w?.notes ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
      <div className='grid grid-cols-2'>
        <label htmlFor='photoUrl'>Photo Url:</label>
        <input
          type='text'
          name='photoUrl'
          id='photoUrl'
          defaultValue={w?.media?.url ?? ''}
          className='px-2 bg-gray-200 text-gray-900'
        />
      </div>
    </>
  );
};

export default WarrantyForm;
