import type { Rent, StrapiResponse, StrapiRent } from '~/types';

export async function getRentByDocumentId(
  documentId: string,
): Promise<StrapiRent> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/rents/${documentId}`,
  );
  const json = await res.json();
  return json.data;
}

export async function getRents(): Promise<{ rentData: Rent[] }> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/rents`);
  const json: StrapiResponse<StrapiRent> = await res.json();

  const rentData = json.data.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    amount: item.amount,
    lastPaidDate: item.lastPaidDate,
    nextDueDate: item.nextDueDate,
    paymentMethod: item.paymentMethod,
    notes: item.notes,
  }));

  return { rentData };
}

export async function updateRent(
  documentId: string,
  updatedRent: Partial<StrapiRent>,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/rents/${documentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRent),
    },
  );
  return res.json();
}
