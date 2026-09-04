import { Outlet } from 'react-router';
import { useState } from 'react';
import useGrocery from '~/hooks/useGrocery';
import useTodo from '~/hooks/useTodo';
import Hero from '~/components/Hero';
import { generateId } from '~/utills/uuid';
import Message from '~/components/Message';

const HomeLayout = () => {
  const { items: groceryItems, updateGrocery } = useGrocery();
  const { items: todoItems, updateTodo } = useTodo();
  const [saved, setSaved] = useState('');

  const addQuickGrocery = (name: string) => {
    const newItem = {
      id: generateId(),
      name,
      assignedTo: 'you',
      createdBy: 'you',
      category: '',
      priority: 'medium' as 'low' | 'medium' | 'high',
      quantity: 1,
      done: false,
    };
    updateGrocery([...groceryItems, newItem]);
    setSaved('Grocery');
  };

  const addQuickTodo = (name: string) => {
    const newItem = {
      id: generateId(),
      name,
      assignedTo: 'you',
      createdBy: 'you',
      category: '',
      priority: 'medium' as 'low' | 'medium' | 'high',
      dueDate: '',
      done: false,
    };
    updateTodo([...todoItems, newItem]);
    setSaved('Todo');
  };

  return (
    <>
      {saved.length > 0 && (
        <Message key={Date.now()} message={`${saved} item added!`} />
      )}
      <Hero
        userName='Pramit'
        onAddGrocery={addQuickGrocery}
        onAddTodo={addQuickTodo}
      />
      <section className='max-w-6xl mx-auto px-6 my-8'>
        <Outlet />
      </section>
    </>
  );
};

export default HomeLayout;
