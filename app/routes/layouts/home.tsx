import { Outlet } from 'react-router';
import { useNavigation } from 'react-router';
import { useState } from 'react';
import useGrocery from '~/context/GroceryContext';
import useTodo from '~/context/TodoContext';
import Hero from '~/components/Hero';
import { generateId } from '~/utills/uuid';
import Message from '~/components/Message';
import { FadeLoader } from 'react-spinners';

const HomeLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state == 'loading';

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
        {/* Overlay spinner here */}
        {isLoading && (
          <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
            <div className='relative z-10 p-8 rounded'>
              <FadeLoader color='lime' />
            </div>
          </div>
        )}
        <Outlet />
      </section>
    </>
  );
};

export default HomeLayout;
