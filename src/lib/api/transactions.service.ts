import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  Transaction,
  CreateTransactionRequest,
  PaginationParams,
} from '@/types/common';

/**
 * Transactions Service
 * Handles all transaction/order management API calls
 */
export const transactionsService = {
  /**
   * Get all transactions (Admin only)
   */
  getAll: async (params?: PaginationParams): Promise<{
    data: Transaction[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await apiClient.get<{ 
      message: string; 
      data: Transaction[] 
    }>('/transactions/admin/all');
    
    // Backend returns all transactions without pagination
    const allTransactions = response.data.data || [];
    
    // Client-side pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    
    // Client-side search (by order number, user email, status)
    let filteredTransactions = allTransactions;
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredTransactions = allTransactions.filter(transaction => 
        transaction.orderNumber.toLowerCase().includes(searchLower) ||
        transaction.status.toLowerCase().includes(searchLower) ||
        (transaction.user?.email || '').toLowerCase().includes(searchLower) ||
        (transaction.user?.nama_panggilan || '').toLowerCase().includes(searchLower)
      );
    }
    
    const total = filteredTransactions.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    return {
      data: paginatedTransactions,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  /**
   * Get transaction by ID
   */
  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<{ 
      message: string; 
      data: Transaction 
    }>(`/transactions/${id}`);
    return response.data.data;
  },

  /**
   * Get transactions by user ID
   */
  getByUserId: async (userId: string): Promise<Transaction[]> => {
    const response = await apiClient.get<{ 
      message: string; 
      data: Transaction[] 
    }>('/transactions');
    return response.data.data;
  },

  /**
   * Create new transaction (Checkout)
   */
  create: async (data: CreateTransactionRequest): Promise<{
    transaction: Transaction;
    paymentUrl: string;
  }> => {
    const response = await apiClient.post<{ 
      message: string; 
      data: Transaction & { paymentUrl?: string } 
    }>('/transactions/checkout', data);
    
    return {
      transaction: response.data.data,
      paymentUrl: response.data.data.paymentUrl || '',
    };
  },

  /**
   * Update transaction status (Admin only)
   */
  updateStatus: async (id: string, status: string): Promise<Transaction> => {
    const response = await apiClient.patch<{ 
      message: string; 
      data: Transaction 
    }>(`/transactions/${id}/status`, { status });
    return response.data.data;
  },

  /**
   * Check payment status
   */
  checkPaymentStatus: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<{ 
      message: string; 
      data: Transaction 
    }>(`/transactions/${id}/check-status`);
    return response.data.data;
  },

  /**
   * Delete transaction (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },

  /**
   * Get transaction statistics (Admin only)
   */
  getStats: async (): Promise<{
    total: number;
    totalRevenue: number;
    pending: number;
    paid: number;
    cancelled: number;
    recentTransactions: Transaction[];
    growth?: number;
  }> => {
    try {
      // Fetch all transactions for stats
      const response = await apiClient.get<{ 
        message: string; 
        data: Transaction[] 
      }>('/transactions/admin/all');
      
      const allTransactions = response.data.data || [];
      
      const total = allTransactions.length;
      const totalRevenue = allTransactions
        .filter(t => t.status === 'PAID')
        .reduce((sum, t) => sum + t.totalAmount, 0);
      
      const pending = allTransactions.filter(t => t.status === 'PENDING').length;
      const paid = allTransactions.filter(t => t.status === 'PAID').length;
      const cancelled = allTransactions.filter(t => 
        ['CANCELLED', 'FAILED'].includes(t.status)
      ).length;
      
      // Get 5 most recent transactions
      const recentTransactions = allTransactions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      return {
        total,
        totalRevenue,
        pending,
        paid,
        cancelled,
        recentTransactions,
      };
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      return {
        total: 0,
        totalRevenue: 0,
        pending: 0,
        paid: 0,
        cancelled: 0,
        recentTransactions: [],
      };
    }
  },
};
