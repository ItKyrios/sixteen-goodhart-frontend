import type { TodoItem } from '~/types';
import { useParams, Navigate, Link } from 'react-router';
import { useState } from 'react';
import useTodo from '~/context/TodoContext';
import { generateId } from '~/utills/uuid';

const TodoEditPage = () => {
  const { id } = useParams();
  const { items, updateTodo } = useTodo();

  const existing = items.find((i) => i.id === id);

  const [form, setForm] = useState<TodoItem>(
    existing || {
      id: generateId(),
      name: '',
      assignedTo: '',
      createdBy: 'loggedinUser',
      category: '',
      priority: 'low',
      dueDate: '',
      done: false,
    },
  );

  const [saved, setSaved] = useState(false);
  const save = () => {
    let updated: TodoItem[];

    if (existing) {
      updated = items.map((i) => (i.id === id ? form : i));
    } else {
      updated = [...items, form];
    }
    updateTodo(updated);
    setSaved(true);
  };

  if (saved) {
    return (
      <Navigate to='/todo' state={{ message: 'Todo item saved!' }} replace />
    );
  }

  const handleChange = <K extends keyof TodoItem>(
    key: K,
    value: TodoItem[K],
  ) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div className='p-4 text-white'>
      <h1 className='text-3xl font-bold text-white mb-2'>
        {existing ? 'Edit Todo Item' : 'Add Todo Item'}
      </h1>

      <div className='flex flex-col gap-3'>
        <label htmlFor='name'>Item Name:</label>
        <input
          type='text'
          name='name'
          id='name'
          value={form.name}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) => handleChange('name', e.target.value)}
        />

        <label htmlFor='assignedTo'>Assigned To:</label>
        <input
          type='text'
          name='assignedTo'
          id='assignedTo'
          value={form.assignedTo}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) => handleChange('assignedTo', e.target.value)}
        />

        <label htmlFor='category'>Category:</label>
        <input
          type='text'
          name='category'
          id='category'
          value={form.category}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) => handleChange('category', e.target.value)}
        />

        <label htmlFor='priority'>Priority:</label>
        <select
          name='priority'
          id='priority'
          value={form.priority}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) =>
            handleChange(
              'priority',
              e.target.value as 'low' | 'medium' | 'high',
            )
          }
        >
          <option value='low'>Low</option>
          <option value='medium'>Medium</option>
          <option value='high'>HIgh</option>
        </select>

        <label htmlFor='dueDate'>Due Date:</label>
        <input
          type='date'
          name='dueDate'
          id='dueDate'
          value={form.dueDate}
          className='p-3 rounded-xs bg-gray-800'
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />

        <label className='flex item-center gap-3'>
          <input
            type='checkbox'
            name='done'
            id='done'
            checked={form.done}
            onChange={(e) => handleChange('done', e.target.checked)}
          />
          Mark as done
        </label>

        <div className='flex gap-4 text-center justify-between'>
          <button
            onClick={save}
            className='mt-4 w-full bg-green-600 p-3 rounded-xs active:scale-95 transition-transform cursor-pointer'
          >
            Save
          </button>
          <Link
            to='/todo'
            className='mt-4 w-full text-red-500 border-2 border-red-600 p-3 rounded-xs active:scale-95 transition-transform'
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TodoEditPage;
