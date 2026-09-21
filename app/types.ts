export type Rent = {
  id: string;
  documentId: string;
  amount: number;
  lastPaidDate: string;
  nextDueDate: string;
  paymentMethod: string;
  notes: string;
};

export type GroceryItem = {
  id: string;
  documentId?: string;
  name: string;
  quantity: number;
  assignedTo: string;
  category: string;
  priority: string;
  done: boolean;
};

export type TodoItem = {
  id: string;
  documentId?: string;
  name: string;
  assignedTo: string;
  category: string;
  priority: string;
  dueDate: string;
  done: boolean;
};

export type Subscription = {
  id: string;
  documentId: string;
  name: string;
  amount: number;
  cycle: string;
  lastRenewed: string;
  nextRenewal: string;
  paymentMethod: string;
  activeStatus: boolean;
  notes: string;
};

export type Warranty = {
  id: string;
  documentId: string;
  name: string;
  model: string;
  amount: number;
  purchaseDate: string;
  warrantyEnd: string;
  notes: string;
  media: { url: string };
};

export type ExpiryItem = {
  id: string;
  documentId: string;
  name: string;
  model: string;
  amount: number;
  purchaseDate: string;
  expiryDate: string;
  notes: string;
  media: { url: string };
};

export type CheckListItemBase = {
  documentId?: string;
  label: string; // name, task, title, etc.
  assignedTo?: string;
  quantity?: number; // optional for modules that don't use it
  dueDate?: string; // optional for module that don't use it
  done: boolean;
  createdBy?: string; //optional
  category?: string; //optional
  priority?: string;
};

export type StrapiResponse<T> = {
  data: T[];
};

export type StrapiSingleResponse<T> = {
  data: T;
};

export type StrapiRent = {
  id: string;
  documentId: string;
  amount: number;
  lastPaidDate: string;
  nextDueDate: string;
  paymentMethod: string;
  notes: string;
};

export type StrapiGrocery = {
  id: string;
  documentId: string;
  name: string;
  quantity: number;
  assignedTo: string;
  category: string;
  priority: string;
  done: boolean;
};

export type StrapiTodo = {
  id: string;
  documentId: string;
  name: string;
  assignedTo: string;
  category: string;
  priority: string;
  dueDate: string;
  done: boolean;
};
