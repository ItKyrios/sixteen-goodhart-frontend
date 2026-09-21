import type { StrapiTodo } from '~/types';
import { createContext, useContext, useState, type ReactNode } from 'react';

type TodoContextValue = {
  todos: StrapiTodo[];
  setTodos: React.Dispatch<React.SetStateAction<StrapiTodo[]>>;
  updateLocalTodo: (item: StrapiTodo) => void;
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<StrapiTodo[]>([]);

  const updateLocalTodo = (updatedItem: StrapiTodo) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.documentId === updatedItem.documentId ? updatedItem : item,
      ),
    );
  };

  return (
    <TodoContext.Provider value={{ todos, setTodos, updateLocalTodo }}>
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
