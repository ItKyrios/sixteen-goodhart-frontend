import type {
  StrapiGrocery,
  StrapiResponse,
  StrapiSingleResponse,
} from '~/types';

// Fetch all groceries
export async function getGroceries(): Promise<StrapiGrocery[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/groceries`);
  const json: StrapiResponse<StrapiGrocery> = await res.json();
  return json.data;
}

// Fetch single grocery
export async function getGroceryByDocumentId(
  documentId: string,
): Promise<StrapiGrocery> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/groceries/${documentId}`,
  );
  const json: StrapiSingleResponse<StrapiGrocery> = await res.json();
  return json.data;
}

// Update grocery
export async function updateGrocery(
  documentId: string,
  updated: Partial<StrapiGrocery>,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/groceries/${documentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    },
  );
  return res.json();
}

// Create grocery
export async function createGrocery(newItem: Partial<StrapiGrocery>) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/groceries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
  return res.json();
}

// Delete grocery
export async function deleteGrocery(documentId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/groceries/${documentId}`,
    {
      method: 'DELETE',
    },
  );
  return res.json();
}
