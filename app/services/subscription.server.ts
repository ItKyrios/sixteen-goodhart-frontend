import type {
  Subscription,
  StrapiResponse,
  StrapiSingleResponse,
} from '~/types';

// Fetch all subscription items
export async function getSubscriptions(): Promise<Subscription[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/subscriptions`);
  const json: StrapiResponse<Subscription> = await res.json();
  return json.data;
}

// Fetch single subscription item
export async function getSubscriptionByDocumentId(
  documentId: string,
): Promise<Subscription> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/subscriptions/${documentId}`,
  );
  const json: StrapiSingleResponse<Subscription> = await res.json();
  return json.data;
}

// Update subscription item
export async function updateSubscription(
  documentId: string,
  updated: Partial<Subscription>,
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/subscriptions/${documentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    },
  );
  return res.json();
}

// Create subscription item
export async function createSubscription(newItem: Partial<Subscription>) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem),
  });
  return res.json();
}

// Delete subscription item
export async function deleteSubscription(documentId: string) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/subscriptions/${documentId}`,
    {
      method: 'DELETE',
    },
  );
  return res.json();
}
