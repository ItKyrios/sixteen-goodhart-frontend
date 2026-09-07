import type { TodoItem } from '~/types';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import data from '~/data/todo.json';

type TodoContextValue = {
  items: TodoItem[];
  updateTodo: (updated: TodoItem[]) => void;
};

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<TodoItem[]>([]);

  // Load from localStorage AFTER hydration
  useEffect(() => {
    const saved = window.localStorage.getItem('todo');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems(data);
    }
  }, []);

  const updateTodo = (updated: TodoItem[]) => {
    setItems(updated);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('todo', JSON.stringify(updated));
    }
  };
  return (
    <TodoContext.Provider value={{ items, updateTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export default function useTodo() {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return ctx;
}
