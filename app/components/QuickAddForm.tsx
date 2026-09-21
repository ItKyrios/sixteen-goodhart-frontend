import type { FetcherWithComponents } from 'react-router';
import { useEffect, useState } from 'react';
import { FaPlusCircle, FaShoppingCart } from 'react-icons/fa';

const QuickAddForm = ({ fetcher }: { fetcher: FetcherWithComponents<any> }) => {
  const [value, setValue] = useState('');

  // Clear input AFTER fetcher submission completes
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      setValue('');
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <input
        type='text'
        name='name'
        placeholder='Type something...'
        className='w-full p-3 rounded-xs bg-gray-800 text-white outline-none mb-3'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <div className='flex gap-3'>
        <button
          type='submit'
          name='type'
          value='grocery'
          className='flex-1 bg-green-600 p-3 rounded-xs text-sm font-medium active:scale-95 transition-transform cursor-pointer'
        >
          <div className='flex justify-between items-center'>
            <span>Add to Grocery</span>
            <FaShoppingCart className='text-lg' />
          </div>
        </button>
        <button
          type='submit'
          name='type'
          value='todo'
          className='flex-1 bg-blue-600 p-3 rounded-xs text-sm font-medium active:scale-95 transition-transform cursor-pointer'
        >
          <div className='flex justify-between items-center'>
            <span>Add Todo </span>
            <FaPlusCircle className='text-lg' />
          </div>
        </button>
      </div>
    </>
  );
};

export default QuickAddForm;
