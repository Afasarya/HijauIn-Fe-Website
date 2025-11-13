import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  Transaction,
  CreateTransactionRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types/common';

/**
 * Transactions Service
 * Handles all transaction management API calls
 */
export const transactionsService = {
  /**
   * Get all transactions with pagination
   */
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Get transaction by ID
   */
  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(API_ENDPOINTS.TRANSACTIONS.BY_ID(id));
    return response.data;
  },

  /**
   * Get transactions by user ID
   */
  getByUserId: async (userId: string): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>(
      API_ENDPOINTS.TRANSACTIONS.BY_USER(userId)
    );
    return response.data;
  },

  /**
   * Create new transaction
   */
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>(API_ENDPOINTS.TRANSACTIONS.BASE, data);
    return response.data;
  },

  /**
   * Update transaction status (admin only)
   */
  updateStatus: async (
    id: string,
    status: string
  ): Promise<Transaction> => {
    const response = await apiClient.patch<Transaction>(API_ENDPOINTS.TRANSACTIONS.BY_ID(id), {
      status,
    });
    return response.data;
  },

  /**
   * Delete transaction
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.TRANSACTIONS.BY_ID(id));
  },

  /**
   * Get transaction statistics
   */
  getStats: async (): Promise<{
    total: number;
    totalRevenue: number;
    pending: number;
    paid: number;
    cancelled: number;
    recentTransactions: Transaction[];
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.TRANSACTIONS.STATS);
    return response.data;
  },
};
