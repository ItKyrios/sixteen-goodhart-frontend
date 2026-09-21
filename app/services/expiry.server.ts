import type { ExpiryItem, StrapiResponse, StrapiSingleResponse } from '~/types';

// Fetch all expiry items
export async function getExpiries(): Promise<ExpiryItem[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/expiries?populate=*`,
  );
  const json: StrapiResponse<ExpiryItem> = await res.json();
  return json.data;
}

// Fetch single expiry item
export async function getExpiryByDocumentId(
  documentId: string,
): Promise<ExpiryItem> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/expiries/${documentId}?populate=*`,
  );
  const json: StrapiSingleResponse<ExpiryItem> = await res.json();
  return json.data;
}

// Update expiry item
export async function updateExpiry(
  documentId: string,
  updated: Partial<ExpiryItem>,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/expiries/${documentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    },
  );
  return res.json();
}

// Create expiry item
export async function createExpiry(newItem: Partial<ExpiryItem>) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/expiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
  return res.json();
}

// Delete expiry item
export async function deleteExpiry(documentId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/expiries/${documentId}`,
    {
      method: 'DELETE',
    },
  );
  return res.json();
}
