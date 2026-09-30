import type {
  Rent,
  StrapiResponse,
  StrapiRent,
  StrapiSingleResponse,
} from '~/types';

// Fetch single rent item
export async function getRentByDocumentId(
  documentId: string,
  jwt: string | null,
): Promise<StrapiRent> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/rents/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  const json: StrapiSingleResponse<StrapiRent> = await res.json();
  return json.data;
}

// Fetch all rent items
export async function getRents(jwt: string | null): Promise<StrapiRent[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/rents`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  const json: StrapiResponse<StrapiRent> = await res.json();
  return json.data;
}

// Update rent
export async function updateRent(
  documentId: string,
  updatedRent: Partial<StrapiRent>,
  jwt: string,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/rents/${documentId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data: updatedRent }),
    },
  );
  return res.json();
}
