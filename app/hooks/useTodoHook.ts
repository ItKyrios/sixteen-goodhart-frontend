import type { TodoItem } from '~/types';
import { useState } from 'react';
import data from '~/data/todo.json';

const useTodo = () => {
  const saved =
    typeof window !== 'undefined' ? window.localStorage.getItem('todo') : null;
  const initial: TodoItem[] = saved ? JSON.parse(saved) : data;
  const [items, setItems] = useState<TodoItem[]>(initial);
  const updateTodo = (updated: TodoItem[]) => {
    setItems(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('todo', JSON.stringify(updated));
    }
  };
  return { items, updateTodo };
};

export default useTodo;
