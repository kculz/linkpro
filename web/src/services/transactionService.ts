import api from './api';

export interface Transaction {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId: string;
  amount: number;
  type: 'RENT' | 'DEPOSIT' | 'MAINTENANCE' | 'OTHER';
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'FAILED';
  paymentMethod?: string;
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  property?: { name: string };
  tenant?: { name: string; email: string };
  unit?: { unitNumber: string };
}

export const getTransactions = async (params: any = {}) => {
  const { data } = await api.get('/transactions', { params });
  return data.data as Transaction[];
};

export const getStats = async () => {
  const { data } = await api.get('/transactions/stats');
  return data.data;
};

export const createTransaction = async (txData: Partial<Transaction>) => {
  const { data } = await api.post('/transactions', txData);
  return data.data as Transaction;
};

export const updateTransaction = async (id: string, txData: Partial<Transaction>) => {
  const { data } = await api.put(`/transactions/${id}`, txData);
  return data.data as Transaction;
};

export interface FinanceIntelligence {
  totalRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  monthlyTrend: { month: string; paid: number; total: number }[];
  revenueByType: { type: string; amount: number }[];
  revenueByProperty: { propertyId: string; revenue: number; name: string; totalUnits: number; occupiedUnits: number }[];
  cashFlow: { income: number; expenses: number; netCashFlow: number };
  collectionRate: { month: string; rate: number }[];
  recentTransactions: Transaction[];
}

export const getFinanceIntelligence = async () => {
  const { data } = await api.get('/transactions/finance-intelligence');
  return data.data as FinanceIntelligence;
};

