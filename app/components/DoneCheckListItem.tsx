import type { CheckListItemBase } from '~/types';
import { Link } from 'react-router';
import { FaPencil } from 'react-icons/fa6';
import { IoTrashOutline } from 'react-icons/io5';

type DoneCheckListItemProps = {
  item: CheckListItemBase;
  link?: string;
  onToggleDone: (id: string) => void;
  onDeleteItem: (id: string) => void;
};

const DoneCheckListItem = ({
  item,
  link = 'edit/',
  onToggleDone,
  onDeleteItem,
}: DoneCheckListItemProps) => {
  return (
    <div
      key={item.documentId}
      className='bg-gray-800 p-2 rounded-xs flex items-center gap-2'
    >
      <input
        type='checkbox'
        checked={item.done}
        onChange={() => onToggleDone(item.documentId || '')}
        className='scale-75'
      />

      <div className='text-sm line-through flex-1'>{item.label}</div>

      <Link
        to={`${link}${item.documentId}`}
        className='border border-blue-500 text-blue-500 px-2 py-1 rounded text-xs'
      >
        <FaPencil />
      </Link>
      <button
        onClick={() => onDeleteItem(item.documentId || '')}
        className='text-red-500 px-2 py-1 rounded text-xs cursor-pointer'
      >
        <IoTrashOutline />
      </button>
    </div>
  );
};

export default DoneCheckListItem;
