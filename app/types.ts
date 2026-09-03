export type GroceryItem = {
  id: string;
  name: string;
  quantity: number;
  assignedTo: string;
  createdBy: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  done: boolean;
};

export type TodoItem = {
  id: string;
  name: string;
  assignedTo: string;
  createdBy: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  done: boolean;
};

export type Subscription = {
  id: string;
  name: string;
  amount: number;
  cycle: 'weekly' | 'monthly' | 'yearly';
  lastRenewed: string;
  nextRenewal: string;
  paymentMethod: 'wise' | 'direct-debit' | 'cash' | 'other';
  status: 'active' | 'inactive';
  notes: string;
};

export type Warranty = {
  id: string;
  name: string;
  model: string;
  amount: number;
  purchaseDate: string;
  expiryDate: string;
  warrantyEnd: string;
  notes: string;
  photoUrl: string;
};

export type CheckListItemBase = {
  id: string;
  label: string; // name, task, title, etc.
  assignedTo?: string;
  quantity?: number; // optional for modules that don't use it
  dueDate?: string; // optional for module that don't use it
  done: boolean;
  createdBy?: string; //optional
  category?: string; //optional
  priority?: 'low' | 'medium' | 'high';
};
