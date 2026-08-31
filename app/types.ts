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
