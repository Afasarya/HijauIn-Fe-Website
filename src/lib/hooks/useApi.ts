/**
 * API Hooks
 * Custom React hooks for data fetching with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import {
  usersService,
  productsService,
  productCategoriesService,
  transactionsService,
  articlesService,
  wasteLocationsService,
  dashboardService,
} from '@/lib/api';
import {
  User,
  Product,
  ProductCategory,
  Transaction,
  Article,
  WasteLocation,
  DashboardStats,
  PaginationParams,
  PaginatedResponse,
} from '@/types/common';

// Generic hook for data fetching
function useApiData<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Dashboard hooks
export function useDashboardStats() {
  return useApiData<DashboardStats>(() => dashboardService.getStats());
}

// Users hooks
export function useUsers(params?: PaginationParams) {
  return useApiData<PaginatedResponse<User>>(
    () => usersService.getAll(params),
    [JSON.stringify(params)]
  );
}

export function useUser(id: string) {
  return useApiData<User>(() => usersService.getById(id), [id]);
}

export function useMe() {
  return useApiData<User>(() => usersService.getMe());
}

export function useUsersStats() {
  return useApiData(() => usersService.getStats());
}

// Products hooks
export function useProducts(params?: PaginationParams) {
  return useApiData<PaginatedResponse<Product>>(
    () => productsService.getAll(params),
    [JSON.stringify(params)]
  );
}

export function useProduct(id: string) {
  return useApiData<Product>(() => productsService.getById(id), [id]);
}

export function useProductsStats() {
  return useApiData(() => productsService.getStats());
}

// Product Categories hooks
export function useProductCategories(params?: PaginationParams) {
  return useApiData<PaginatedResponse<ProductCategory>>(
    () => productCategoriesService.getAll(params),
    [JSON.stringify(params)]
  );
}

export function useProductCategory(id: string) {
  return useApiData<ProductCategory>(
    () => productCategoriesService.getById(id),
    [id]
  );
}

// Transactions hooks
export function useTransactions(params?: PaginationParams) {
  return useApiData<PaginatedResponse<Transaction>>(
    () => transactionsService.getAll(params),
    [JSON.stringify(params)]
  );
}

export function useTransaction(id: string) {
  return useApiData<Transaction>(() => transactionsService.getById(id), [id]);
}

export function useTransactionsByUser(userId: string) {
  return useApiData<Transaction[]>(
    () => transactionsService.getByUserId(userId),
    [userId]
  );
}

export function useTransactionsStats() {
  return useApiData(() => transactionsService.getStats());
}

// Articles hooks
export function useArticles(params?: PaginationParams) {
  return useApiData<PaginatedResponse<Article>>(
    () => articlesService.getAll(params),
    [JSON.stringify(params)]
  );
}

export function useArticle(id: string) {
  return useApiData<Article>(() => articlesService.getById(id), [id]);
}

export function useArticleBySlug(slug: string) {
  return useApiData<Article>(() => articlesService.getBySlug(slug), [slug]);
}

export function useArticlesStats() {
  return useApiData(() => articlesService.getStats());
}

// Waste Locations hooks
export function useWasteLocations(params?: PaginationParams) {
  return useApiData<PaginatedResponse<WasteLocation>>(
    () => wasteLocationsService.getAll(params),
    [JSON.stringify(params)]
  );
}

export function useWasteLocation(id: string) {
  return useApiData<WasteLocation>(
    () => wasteLocationsService.getById(id),
    [id]
  );
}

export function useWasteLocationsStats() {
  return useApiData(() => wasteLocationsService.getStats());
}
