import type { Warranty, StrapiResponse, StrapiSingleResponse } from '~/types';

// Fetch all warranty items
export async function getWarranties(): Promise<Warranty[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/warranties?populate=*`,
  );
  const json: StrapiResponse<Warranty> = await res.json();
  return json.data;
}

// Fetch single warranty item
export async function getWarrantyByDocumentId(
  documentId: string,
): Promise<Warranty> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/warranties/${documentId}?populate=*`,
  );
  const json: StrapiSingleResponse<Warranty> = await res.json();
  return json.data;
}

// Update warranty item
export async function updateWarranty(
  documentId: string,
  updated: Partial<Warranty>,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/warranties/${documentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    },
  );
  return res.json();
}

// Create warranty item
export async function createWarranty(newItem: Partial<Warranty>) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/warranties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
  return res.json();
}

// Delete warranty item
export async function deleteWarranty(documentId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/warranties/${documentId}`,
    {
      method: 'DELETE',
    },
  );
  return res.json();
}
