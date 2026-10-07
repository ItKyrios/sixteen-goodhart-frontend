import type {
  Subscription,
  StrapiResponse,
  StrapiSingleResponse,
} from '~/types';

// Fetch all subscription items
export async function getSubscriptions(
  jwt: string | null,
): Promise<Subscription[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/subscriptions?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  const json: StrapiResponse<Subscription> = await res.json();
  return json.data;
}

// Fetch single subscription item
export async function getSubscriptionByDocumentId(
  documentId: string,
  jwt: string | null,
): Promise<Subscription> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/subscriptions/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  const json: StrapiSingleResponse<Subscription> = await res.json();
  return json.data;
}

// Update subscription item
export async function updateSubscription(
  documentId: string,
  updated: Partial<Subscription>,
  jwt: string,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/subscriptions/${documentId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ data: updated }),
    },
  );
  console.log({ data: updated });
  return res.json();
}

// Create subscription item
export async function createSubscription(
  newItem: Partial<Subscription>,
  jwt: string | null,
) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ data: newItem }),
  });
  return res.json();
}

// Delete subscription item
export async function deleteSubscription(
  documentId: string,
  jwt: string | null,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/subscriptions/${documentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
  );
  return res.json();
}
