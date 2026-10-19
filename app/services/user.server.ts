import type { User } from '~/types';

// Fetch single user item
export async function getUser(jwt: string | null): Promise<User> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  return json;
}
