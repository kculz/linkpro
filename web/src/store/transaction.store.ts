import { create } from 'zustand';
import * as transactionService from '@/services/transactionService';

interface TransactionState {
  transactions: transactionService.Transaction[];
  stats: { totalRevenue: number; pendingRevenue: number; overdueRevenue: number } | null;
  financeIntel: transactionService.FinanceIntelligence | null;
  loading: boolean;
  fetchTransactions: (params?: any) => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchFinanceIntel: () => Promise<void>;
  addTransaction: (data: Partial<transactionService.Transaction>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<transactionService.Transaction>) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  stats: null,
  financeIntel: null,
  loading: false,
  fetchTransactions: async (params) => {
    set({ loading: true });
    try {
      const transactions = await transactionService.getTransactions(params);
      set({ transactions, loading: false });
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      set({ loading: false });
    }
  },
  fetchStats: async () => {
    try {
      const stats = await transactionService.getStats();
      set({ stats });
    } catch (err) {
      console.error('Failed to fetch financial stats', err);
    }
  },
  fetchFinanceIntel: async () => {
    set({ loading: true });
    try {
      const financeIntel = await transactionService.getFinanceIntelligence();
      set({ financeIntel, loading: false });
    } catch (err) {
      console.error('Failed to fetch finance intelligence', err);
      set({ loading: false });
    }
  },
  addTransaction: async (data) => {
    const newTx = await transactionService.createTransaction(data);
    set({ transactions: [newTx, ...get().transactions] });
    get().fetchStats();
  },
  updateTransaction: async (id, data) => {
    const updated = await transactionService.updateTransaction(id, data);
    set({ transactions: get().transactions.map(t => t.id === id ? updated : t) });
    get().fetchStats();
  },
}));
