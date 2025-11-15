import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types/common';

/**
 * Articles Service
 * Handles all article management API calls
 */
export const articlesService = {
  /**
   * Upload image for article (Admin only)
   */
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post<{
      message: string;
      data: { url: string; filename: string };
    }>(
      API_ENDPOINTS.ARTICLES.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Get all articles with pagination
   */
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Article>> => {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      API_ENDPOINTS.ARTICLES.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Get article by ID
   */
  getById: async (id: string): Promise<Article> => {
    const response = await apiClient.get<Article>(API_ENDPOINTS.ARTICLES.BY_ID(id));
    return response.data;
  },

  /**
   * Get article by slug
   */
  getBySlug: async (slug: string): Promise<Article> => {
    const response = await apiClient.get<Article>(API_ENDPOINTS.ARTICLES.BY_SLUG(slug));
    return response.data;
  },

  /**
   * Create new article
   */
  create: async (data: CreateArticleRequest): Promise<Article> => {
    const response = await apiClient.post<Article>(API_ENDPOINTS.ARTICLES.BASE, data);
    return response.data;
  },

  /**
   * Update article
   */
  update: async (id: string, data: UpdateArticleRequest): Promise<Article> => {
    const response = await apiClient.patch<Article>(API_ENDPOINTS.ARTICLES.BY_ID(id), data);
    return response.data;
  },

  /**
   * Delete article
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.ARTICLES.BY_ID(id));
  },

  /**
   * Get article statistics
   */
  getStats: async (): Promise<{
    total: number;
    recentArticles: Article[];
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.ARTICLES.STATS);
    return response.data;
  },
};
