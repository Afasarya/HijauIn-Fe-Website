import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  WasteLocation,
  CreateWasteLocationRequest,
  UpdateWasteLocationRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types/common';

/**
 * Waste Locations Service
 * Handles all waste location management API calls
 */
export const wasteLocationsService = {
  /**
   * Get all waste locations with pagination
   */
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<WasteLocation>> => {
    const response = await apiClient.get<PaginatedResponse<WasteLocation>>(
      API_ENDPOINTS.WASTE_LOCATIONS.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Get waste location by ID
   */
  getById: async (id: string): Promise<WasteLocation> => {
    const response = await apiClient.get<WasteLocation>(
      API_ENDPOINTS.WASTE_LOCATIONS.BY_ID(id)
    );
    return response.data;
  },

  /**
   * Create new waste location
   */
  create: async (data: CreateWasteLocationRequest): Promise<WasteLocation> => {
    const response = await apiClient.post<WasteLocation>(
      API_ENDPOINTS.WASTE_LOCATIONS.BASE,
      data
    );
    return response.data;
  },

  /**
   * Update waste location
   */
  update: async (id: string, data: UpdateWasteLocationRequest): Promise<WasteLocation> => {
    const response = await apiClient.patch<WasteLocation>(
      API_ENDPOINTS.WASTE_LOCATIONS.BY_ID(id),
      data
    );
    return response.data;
  },

  /**
   * Delete waste location
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WASTE_LOCATIONS.BY_ID(id));
  },

  /**
   * Get waste location statistics
   */
  getStats: async (): Promise<{
    total: number;
    byCategory: {
      ORGANIK: number;
      ANORGANIK: number;
      B3: number;
    };
  }> => {
    const response = await apiClient.get(API_ENDPOINTS.WASTE_LOCATIONS.STATS);
    return response.data;
  },
};
