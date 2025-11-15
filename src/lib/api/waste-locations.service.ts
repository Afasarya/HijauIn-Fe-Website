import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  WasteLocation,
  CreateWasteLocationRequest,
  UpdateWasteLocationRequest,
  WasteLocationsResponse,
  WasteLocationResponse,
  WasteLocationStats,
  WasteCategory,
} from '@/types/waste-location';

/**
 * Waste Locations Service
 * Handles all waste location management API calls
 */
export const wasteLocationsService = {
  /**
   * Upload image for waste location (Admin only)
   */
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post<{
      message: string;
      data: { url: string; filename: string };
    }>(
      API_ENDPOINTS.WASTE_LOCATIONS.UPLOAD,
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
   * Get all waste locations (Admin)
   * @param categories - Optional filter by categories
   */
  getAll: async (categories?: WasteCategory[]): Promise<WasteLocationsResponse> => {
    const params = categories?.length ? { categories: categories.join(',') } : undefined;
    const response = await apiClient.get<WasteLocationsResponse>(
      API_ENDPOINTS.WASTE_LOCATIONS.BASE,
      { params }
    );
    return response.data;
  },

  /**
   * Get waste location by ID
   */
  getById: async (id: string): Promise<WasteLocation> => {
    const response = await apiClient.get<WasteLocationResponse>(
      API_ENDPOINTS.WASTE_LOCATIONS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * Create new waste location (Admin only)
   */
  create: async (data: CreateWasteLocationRequest): Promise<WasteLocation> => {
    const response = await apiClient.post<WasteLocationResponse>(
      API_ENDPOINTS.WASTE_LOCATIONS.BASE,
      data
    );
    return response.data.data;
  },

  /**
   * Update waste location (Admin only)
   */
  update: async (id: string, data: UpdateWasteLocationRequest): Promise<WasteLocation> => {
    const response = await apiClient.patch<WasteLocationResponse>(
      API_ENDPOINTS.WASTE_LOCATIONS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete waste location (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WASTE_LOCATIONS.BY_ID(id));
  },

  /**
   * Get waste location statistics
   */
  getStats: async (): Promise<WasteLocationStats> => {
    const locations = await wasteLocationsService.getAll();
    
    // Calculate stats from locations data
    const stats: WasteLocationStats = {
      total: locations.count,
      organik: 0,
      anorganik: 0,
      b3: 0,
    };

    locations.data.forEach((location) => {
      if (location.categories.includes(WasteCategory.ORGANIK)) {
        stats.organik++;
      }
      if (location.categories.includes(WasteCategory.ANORGANIK)) {
        stats.anorganik++;
      }
      if (location.categories.includes(WasteCategory.B3)) {
        stats.b3++;
      }
    });

    return stats;
  },

  /**
   * Get public waste locations (for public access)
   */
  getPublic: async (): Promise<WasteLocation[]> => {
    const response = await apiClient.get<WasteLocationsResponse>(
      API_ENDPOINTS.WASTE_LOCATIONS.PUBLIC
    );
    return response.data.data;
  },

  /**
   * Find nearby waste locations
   */
  findNearby: async (params: {
    lat: number;
    lng: number;
    radius?: number;
    categories?: WasteCategory[];
  }): Promise<WasteLocation[]> => {
    const queryParams = {
      lat: params.lat,
      lng: params.lng,
      radius: params.radius || 5000,
      categories: params.categories?.join(','),
    };
    
    const response = await apiClient.get<WasteLocationsResponse>(
      API_ENDPOINTS.WASTE_LOCATIONS.NEARBY,
      { params: queryParams }
    );
    return response.data.data;
  },
};
