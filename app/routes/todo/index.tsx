import type { Route } from './+types';
import { Link, useLocation } from 'react-router';
import useTodo from '~/context/TodoContext';
import Message from '~/components/Message';
import { useState, useEffect } from 'react';
import CheckListItem from '~/components/CheckListItem';
import DoneCheckListItem from '~/components/DoneCheckListItem';
import type { StrapiTodo } from '~/types';
import { getTodos } from '~/services/todo.server';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sixteen Goodhart | Todos' },
    { name: 'description', content: 'A web app for home' },
  ];
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ todosData: StrapiTodo[] }> {
  const todosData = await getTodos();
  return { todosData };
}

const TodoPage = ({ loaderData }: Route.ComponentProps) => {
  const [showDone, setShowDone] = useState(false);
  const { todosData } = loaderData;
  const { todos, setTodos } = useTodo();
  useEffect(() => {
    setTodos(todosData);
  }, [todosData, setTodos]);

  const { search } = useLocation();
  const message = new URLSearchParams(search).get('message');

  const toggleDone = (documentId: string) => {
    const updated = todos.map((item) =>
      item.documentId === documentId ? { ...item, done: !item.done } : item,
    );
    setTodos(updated);
  };

  const deleteItem = (documentId: string) => {
    const updated = todos.filter((i) => i.documentId !== documentId);
    setTodos(updated);
  };

  const activeItems = todos.filter((i) => !i.done);
  const doneItems = todos.filter((i) => i.done);

  return (
    <div className='p-4 text-white'>
      <div className='grid grid-cols-2'>
        <h1 className='text-3xl font-bold text-white mb-2'>Todo</h1>
        <Link
          to='/todo/new'
          className='ml-auto bg-green-600 px-8 py-2 mb-2 rounded-full hover:bg-green-700 active:scale-95 transition-transform cursor-pointer'
        >
          Add
        </Link>
      </div>

      {message && <Message message={message} />}

      <div className='flex flex-col gap-3'>
        {activeItems.map((item) => (
          <CheckListItem
            key={item.documentId}
            item={{
              documentId: item.documentId,
              label: item.name,
              assignedTo: item.assignedTo,
              dueDate: item.dueDate,
              done: item.done,
              priority: item.priority,
            }}
            onToggleDone={toggleDone}
            onDeleteItem={deleteItem}
          />
        ))}
      </div>

      {/* Completed Section */}
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
              <DoneCheckListItem
                key={item.documentId}
                item={{
                  documentId: item.documentId,
                  label: item.name,
                  done: item.done,
                }}
                onToggleDone={toggleDone}
                onDeleteItem={deleteItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;
