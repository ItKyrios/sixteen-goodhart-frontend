import type {
  ExpiryItem,
  GroceryItem,
  Rent,
  TodoItem,
  Subscription,
  Warranty,
  User,
} from '~/types';
import { createContext, useContext, useEffect, useState } from 'react';

export interface AppState {
  expiry: ExpiryItem[];
  warranty: Warranty[];
  groceries: GroceryItem[];
  rent: Rent[];
  subscription: Subscription[];
  todo: TodoItem[];
  user: User | null;
  loaded: boolean;
}

interface AppContextType {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  calcDaysLeft: (item: Rent) => number;
  totalMonthly: number;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppState>({
    expiry: [],
    warranty: [],
    groceries: [],
    rent: [],
    subscription: [],
    todo: [],
    user: null,
    loaded: false,
  });

  // ⭐ 1. Load persisted state on mount
  useEffect(() => {
    const saved = localStorage.getItem('appState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure loaded flag is false so Home can hydrate fresh data after login
      setAppState({
        ...parsed,
        loaded: parsed.loaded ?? false,
      });
    }
  }, []);

  // ⭐ 2. Persist state whenever it changes (after hydration)
  useEffect(() => {
    if (appState.loaded) {
      localStorage.setItem('appState', JSON.stringify(appState));
    }
  }, [appState]);

  //   Calculate total days left for rent tile in home page
  const calcDaysLeft = (rentItem: Rent) => {
    const due = new Date(rentItem?.nextDueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  //   Calculate monthly total cost for subscription tile in home page
  let totalMonthly = 0;
  appState.subscription.map((s) => {
    switch (s.cycle) {
      case 'daily':
        s.activeStatus && (totalMonthly += s.amount * 30);
        break;
      case 'weekly':
        s.activeStatus && (totalMonthly += s.amount * 4);
        break;
      case 'fortnightly':
        s.activeStatus && (totalMonthly += s.amount * 2);
        break;
      case 'monthly':
        s.activeStatus && (totalMonthly += s.amount);
        break;
      case 'annually':
        s.activeStatus && (totalMonthly += s.amount / 12);
        break;

      default:
        break;
    }
  });

  return (
    <AppContext.Provider
      value={{ appState, setAppState, calcDaysLeft, totalMonthly }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
