import type { Warranty, StrapiResponse, StrapiSingleResponse } from '~/types';

// Fetch all warranty items
export async function getWarranties(jwt: string | null): Promise<Warranty[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/warranties?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  const json: StrapiResponse<Warranty> = await res.json();
  return json.data;
}

// Fetch single warranty item
export async function getWarrantyByDocumentId(
  documentId: string,
  jwt: string | null,
): Promise<Warranty> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/warranties/${documentId}?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  const json: StrapiSingleResponse<Warranty> = await res.json();
  return json.data;
}

// Update warranty item
export async function updateWarranty(
  documentId: string,
  updated: Partial<Warranty>,
  jwt: string,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/warranties/${documentId}`,
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

// Create warranty item
export async function createWarranty(
  newItem: Partial<Warranty>,
  jwt: string | null,
) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/warranties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ data: newItem }),
  });
  return res.json();
}

// Delete warranty item
export async function deleteWarranty(documentId: string, jwt: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/warranties/${documentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  return res.json();
}
