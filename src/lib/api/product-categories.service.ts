import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  ProductCategory,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types/common';

/**
 * Product Categories Service
 * Handles all product category management API calls
 */
export const productCategoriesService = {
  /**
   * Get all product categories with pagination
   */
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<ProductCategory>> => {
    const response = await apiClient.get<PaginatedResponse<ProductCategory>>(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Get product category by ID
   */
  getById: async (id: string): Promise<ProductCategory> => {
    const response = await apiClient.get<ProductCategory>(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BY_ID(id)
    );
    return response.data;
  },

  /**
   * Create new product category
   */
  create: async (data: CreateProductCategoryRequest): Promise<ProductCategory> => {
    const response = await apiClient.post<ProductCategory>(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BASE,
      data
    );
    return response.data;
  },

  /**
   * Update product category
   */
  update: async (id: string, data: UpdateProductCategoryRequest): Promise<ProductCategory> => {
    const response = await apiClient.patch<ProductCategory>(
      API_ENDPOINTS.PRODUCT_CATEGORIES.BY_ID(id),
      data
    );
    return response.data;
  },

  /**
   * Delete product category
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PRODUCT_CATEGORIES.BY_ID(id));
  },
};
