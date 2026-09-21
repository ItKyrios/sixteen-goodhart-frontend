import type { TodoItem } from '~/types';

type Props = {
  todo?: TodoItem; //optional for new item
};

const TodoForm = ({ todo }: Props) => {
  return (
    <>
      <label htmlFor='name'>Item Name:</label>
      <input
        type='text'
        name='name'
        id='name'
        defaultValue={todo?.name ?? ''}
        className='p-3 rounded-xs bg-gray-800'
      />

      <label htmlFor='assignedTo'>Assigned To:</label>
      <input
        type='text'
        name='assignedTo'
        id='assignedTo'
        defaultValue={todo?.assignedTo ?? ''}
        className='p-3 rounded-xs bg-gray-800'
      />

      <label htmlFor='category'>Category:</label>
      <input
        type='text'
        name='category'
        id='category'
        defaultValue={todo?.category ?? ''}
        className='p-3 rounded-xs bg-gray-800'
      />

      <label htmlFor='priority'>Priority:</label>
      <select
        name='priority'
        id='priority'
        defaultValue={todo?.priority ?? 'medium'}
        className='p-3 rounded-xs bg-gray-800'
      >
        <option value='low'>Low</option>
        <option value='medium'>Medium</option>
        <option value='high'>High</option>
      </select>

      <label htmlFor='dueDate'>Due Date:</label>
      <input
        type='date'
        name='dueDate'
        id='dueDate'
        defaultValue={todo?.dueDate ?? ''}
        className='p-3 rounded-xs bg-gray-800'
      />
    </>
  );
};

export default TodoForm;
