import { Link, useLocation } from 'react-router';
import useGrocery from '~/hooks/useGrocery';
import Message from '~/components/Message';
import { FaPencil } from 'react-icons/fa6';
import { useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';

const GroceriesPage = () => {
  const [showDone, setShowDone] = useState(false);
  const { items, updateGrocery } = useGrocery();
  const location = useLocation();
  const message = location.state?.message;

  const toggleDone = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item,
    );

    updateGrocery(updated);
  };

  const activeItems = items.filter((i) => !i.done);
  const doneItems = items.filter((i) => i.done);

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2 items-center'>
        <h1 className='text-3xl font-bold text-white mb-2'>Groceries</h1>
        <Link
          to='/groceries/edit/new'
          className='ml-auto bg-green-600 px-8 py-2 mb-2 rounded-full hover:bg-green-700 active:scale-95 transition-transform cursor-pointer'
        >
          Add
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {activeItems.map((item) => (
          <div className='mb-2'>
            <div className='bg-gray-900 p-4 rounded-t-xs shadow-md flex items-center gap-3'>
              <input
                type='checkbox'
                name='done'
                id='done'
                checked={item.done}
                className='cursor-pointer'
                onChange={() => toggleDone(item.id)}
              />
              <div className={item.done ? 'line-through opacity-60' : ''}>
                {item.name}
              </div>
              <div className='ml-auto'>
                <Link
                  key={item.id}
                  to={`/groceries/edit/${item.id}`}
                  className='border border-blue-400 text-blue-400 rounded-xs py-2 px-4'
                >
                  <FaPencil className='inline text-xs' /> Edit
                </Link>
                <button
                  key={item.id}
                  onClick={() =>
                    updateGrocery(items.filter((i) => i.id !== item.id))
                  }
                  className='text-red-600 rounded-xs ml-2 cursor-pointer'
                >
                  <IoTrashOutline className='inline text-lg' />
                </button>
              </div>
            </div>
            <div className='text-gray-100 text-xs rounded-b-xs bg-gray-700 flex flex-row-reverse justify-between'>
              <div className='px-4'>
                Assigned to:{' '}
                {item.assignedTo.charAt(0).toUpperCase() +
                  item.assignedTo.slice(1)}
              </div>
              <div className='px-4'>
                {item.quantity && `Qty: ${item.quantity}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Items */}
      <div className='mt-6'>
        <button
          onClick={() => setShowDone(!showDone)}
          className='w-full bg-gray-800 p-2 rounded-xs text-left flex justify-between items-center'
        >
          <span className='text-sm font-semibold'>Completed Items</span>
          <span>{showDone ? '▲' : '▼'}</span>
        </button>

        {showDone && (
          <div className='flex flex-col gap-2 mt-3'>
            {doneItems.length === 0 && (
              <p className='bg-gray-800 p-2 rounded-xs text-xs flex items-center gap-2 opacity-70'>
                No completed items
              </p>
            )}
            {doneItems.map((item) => (
              <div
                key={item.id}
                className='bg-gray-800 p-2 rounded-xs flex items-center gap-2'
              >
                <input
                  type='checkbox'
                  checked={item.done}
                  onChange={() => toggleDone(item.id)}
                  className='scale-75'
                />

                <div className='text-sm line-through flex-1'>{item.name}</div>

                <Link
                  to={`/groceries/edit/${item.id}`}
                  className='border border-blue-500 text-blue-500 px-2 py-1 rounded text-xs'
                >
                  <FaPencil />
                </Link>
                <button
                  onClick={() =>
                    updateGrocery(items.filter((i) => i.id !== item.id))
                  }
                  className='text-red-500 px-2 py-1 rounded text-xs cursor-pointer'
                >
                  <IoTrashOutline />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceriesPage;
