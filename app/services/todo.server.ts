import type { StrapiTodo, StrapiResponse, StrapiSingleResponse } from '~/types';

// Fetch all todos
export async function getTodos(jwt: string | null): Promise<StrapiTodo[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  const json: StrapiResponse<StrapiTodo> = await res.json();
  return json.data;
}

// Fetch single todo
export async function getTodoByDocumentId(
  documentId: string,
  jwt: string | null,
): Promise<StrapiTodo> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/todos/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  const json: StrapiSingleResponse<StrapiTodo> = await res.json();
  return json.data;
}

// Update todo
export async function updateTodo(
  documentId: string,
  updated: Partial<StrapiTodo>,
  jwt: string | null,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/todos/${documentId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data: updated }),
    },
  );
  return res.json();
}

// Create todo
export async function createTodo(
  newItem: Partial<StrapiTodo>,
  jwt: string | null,
) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ data: newItem }),
  });
  return res.json();
}

// Delete todo
export async function deleteTodo(documentId: string, jwt: string | null) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/todos/${documentId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
    },
  );
  return res.json();
}
