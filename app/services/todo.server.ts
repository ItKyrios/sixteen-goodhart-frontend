import type { StrapiTodo, StrapiResponse, StrapiSingleResponse } from '~/types';

// Fetch all todos
export async function getTodos(): Promise<StrapiTodo[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`);
  const json: StrapiResponse<StrapiTodo> = await res.json();
  return json.data;
}

// Fetch single todo
export async function getTodoByDocumentId(
  documentId: string,
): Promise<StrapiTodo> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/todos/${documentId}`,
  );
  const json: StrapiSingleResponse<StrapiTodo> = await res.json();
  return json.data;
}

// Update todo
export async function updateTodo(
  documentId: string,
  updated: Partial<StrapiTodo>,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/todos/${documentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    },
  );
  return res.json();
}

// Create todo
export async function createTodo(newItem: Partial<StrapiTodo>) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
  return res.json();
}

// Delete todo
export async function deleteTodo(documentId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/todos/${documentId}`,
    {
      method: 'DELETE',
    },
  );
  return res.json();
}
