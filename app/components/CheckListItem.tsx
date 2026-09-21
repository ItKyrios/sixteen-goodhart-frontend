import type { CheckListItemBase } from '~/types';
import { Link } from 'react-router';
import { FaPencil } from 'react-icons/fa6';
import { IoTrashOutline } from 'react-icons/io5';

type CheckListItemProps = {
  item: CheckListItemBase;
  link?: string;
  onToggleDone: (id: string) => void;
  onDeleteItem: (id: string) => void;
};

const CheckListItem = ({
  item,
  link = 'edit/',
  onToggleDone,
  onDeleteItem,
}: CheckListItemProps) => {
  return (
    <div className='mb-2' key={item.documentId}>
      <div className='bg-gray-900 p-4 rounded-t-xs shadow-md flex justify-between items-center gap-3'>
        <input
          type='checkbox'
          name='done'
          id='done'
          checked={item.done}
          className='cursor-pointer w-6 h-6'
          onChange={() => onToggleDone(item.documentId || '')}
        />
        <div
          className={`max-w-40 md:max-w-100 font-semibold ${item.done ? 'line-through opacity-60' : ''}`}
        >
          {item.label}
        </div>

        {/* Only show for high priority */}
        {item.priority === 'high' && (
          <div className='px-4 border border-red-700 text-red-700 text-xs rounded'>
            {item.priority.charAt(0).toUpperCase() +
              item.priority.slice(1).toLowerCase()}
          </div>
        )}
        <div className='ml-auto'>
          <Link
            to={`${link}${item.documentId || ''}`}
            className='border border-blue-400 text-blue-400 rounded-xs py-2 px-4'
          >
            <FaPencil className='inline text-xs' /> Edit
          </Link>
          <button
            onClick={() => onDeleteItem(item.documentId || '')}
            className='text-red-600 rounded-xs ml-2 cursor-pointer'
          >
            <IoTrashOutline className='inline text-lg' />
          </button>
        </div>
      </div>
      <div className='py-2 border-t border-gray-800 text-gray-400 text-xs rounded-b-xs bg-gray-900 flex flex-row-reverse justify-between'>
        <div className='px-4'>
          {item.assignedTo &&
            'Assigned to: ' +
              item.assignedTo.charAt(0).toUpperCase() +
              item.assignedTo.slice(1).toLowerCase()}
        </div>

        {/* Only show if the Due Date is there from the main page that uses this component */}
        {item.dueDate && (
          <div className='px-4'>{new Date(item.dueDate).toDateString()}</div>
        )}

        {/* Only show if the Quantity is there from the main page that uses this component */}
        {item.quantity && <div className='px-4'>{`Qty: ${item.quantity}`}</div>}
      </div>
    </div>
  );
};

export default CheckListItem;
