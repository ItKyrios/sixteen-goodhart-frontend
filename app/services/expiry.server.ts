import type { ExpiryItem, StrapiResponse, StrapiSingleResponse } from '~/types';

// Fetch all expiry items
export async function getExpiries(jwt: string | null): Promise<ExpiryItem[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/expiries?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  const json: StrapiResponse<ExpiryItem> = await res.json();
  return json.data;
}

// Fetch single expiry item
export async function getExpiryByDocumentId(
  documentId: string,
  jwt: string | null,
): Promise<ExpiryItem> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/expiries/${documentId}?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  const json: StrapiSingleResponse<ExpiryItem> = await res.json();
  return json.data;
}

// Update expiry item
export async function updateExpiry(
  documentId: string,
  updated: Partial<ExpiryItem>,
  jwt: string,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/expiries/${documentId}`,
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

// Create expiry item
export async function createExpiry(
  newItem: Partial<ExpiryItem>,
  jwt: string | null,
) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/expiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ data: newItem }),
  });
  return res.json();
}

// Delete expiry item
export async function deleteExpiry(documentId: string, jwt: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/expiries/${documentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  return res.json();
}
