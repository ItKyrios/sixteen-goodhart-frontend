import React, { useState } from 'react';
import { FaPlusCircle, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router';

type HeroProps = {
  userName: string;
  text?: string;
  onAddGrocery: (item: string) => void;
  onAddTodo: (item: string) => void;
};

const Hero = ({
  userName = '[NAME]',
  text = "Welcome to Sixteen Goodhart App. Hope you're having a productive day.",
  onAddGrocery,
  onAddTodo,
}: HeroProps) => {
  const [input, setInput] = useState('');

  const handleGrocery = () => {
    if (!input.trim()) return;
    onAddGrocery(input.trim());
    setInput('');
  };
  const handleTodo = () => {
    if (!input.trim()) return;
    onAddTodo(input.trim());
    setInput('');
  };

  return (
    <header className='text-center py-10 px-4 bg-gray-900 text-white transition-colors duration-300'>
      <h2 className='text-xl font-bold mb-4'>Hey, {userName} 👋</h2>
      <p className='text-sm text-gray-300 max-w-2xl mx-auto mb-6'>{text}</p>

      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Type something...'
        className='w-full p-3 rounded-xs bg-gray-800 text-white outline-none mb-3'
      />

      <div className='flex gap-3'>
        <button className='flex-1 bg-green-600 p-3 rounded-xs text-sm font-medium active:scale-95 transition-transform cursor-pointer'>
          <div className='flex justify-between items-center'>
            <span>Add to Grocery</span>
            <FaShoppingCart className='text-lg' />
          </div>
        </button>
        <button className='flex-1 bg-blue-600 p-3 rounded-xs text-sm font-medium active:scale-95 transition-transform cursor-pointer'>
          <div className='flex justify-between items-center'>
            <span>Add Todo </span>
            <FaPlusCircle className='text-lg' />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Hero;
