import type {
  ExpiryItem,
  GroceryItem,
  Rent,
  TodoItem,
  Subscription,
  Warranty,
  User,
} from '~/types';
import { getRents } from '~/services/rent.server';
import { getGroceries } from '~/services/grocery.server';
import { getTodos } from '~/services/todo.server';
import { getWarranties } from '~/services/warranty.server';
import { getExpiries } from '~/services/expiry.server';
import { getSubscriptions } from '~/services/subscription.server';
import { getUser } from '~/services/user.server';

const fetchAllUserData = async (
  jwt: string | null,
): Promise<{
  rentData: Rent[];
  groceriesData: GroceryItem[];
  todosData: TodoItem[];
  warrantyData: Warranty[];
  expiryData: ExpiryItem[];
  subscriptionData: Subscription[];
  userData: User;
}> => {
  const [
    rentData,
    groceriesData,
    todosData,
    warrantyData,
    expiryData,
    subscriptionData,
    userData,
  ] = await Promise.all([
    getRents(jwt),
    getGroceries(jwt),
    getTodos(jwt),
    getWarranties(jwt),
    getExpiries(jwt),
    getSubscriptions(jwt),
    getUser(jwt),
  ]);
  return {
    rentData,
    groceriesData,
    todosData,
    warrantyData,
    expiryData,
    subscriptionData,
    userData,
  };
};

export default fetchAllUserData;
