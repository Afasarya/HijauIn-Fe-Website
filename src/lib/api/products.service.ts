import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types/common';

/**
 * Products Service
 * Handles all product management API calls
 */
export const productsService = {
  /**
   * Get all products with pagination
   */
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.BASE, {
      params,
    });
    return response.data;
  },

  /**
   * Get product by ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new product
   */
  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.BASE, data);
    return response.data;
  },

  /**
   * Update product
   */
  update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.patch<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id), data);
    return response.data;
  },

  /**
   * Delete product
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  },

  /**
   * Get product statistics
   */
  getStats: async (): Promise<{
    total: number;
    totalStock: number;
    lowStock: number;
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.STATS);
    return response.data;
  },
};
