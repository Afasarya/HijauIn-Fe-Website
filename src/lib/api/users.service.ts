import apiClient from './client';
import { API_ENDPOINTS } from './config';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginationParams,
} from '@/types/common';

/**
 * Users Service
 * Handles all user management API calls
 */
export const usersService = {
  /**
   * Get all users (Admin only)
   * Note: Backend doesn't support pagination yet, we'll handle it client-side
   */
  getAll: async (params?: PaginationParams): Promise<{
    data: User[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await apiClient.get<{ message: string; users: User[] }>(
      API_ENDPOINTS.USERS.BASE
    );
    
    // Backend returns { message, users } - we need to transform to paginated format
    const allUsers = response.data.users || [];
    
    // Client-side pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    
    // Client-side search
    let filteredUsers = allUsers;
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = allUsers.filter(user => 
        user.nama_panggilan.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    return {
      data: paginatedUsers,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  },

  /**
   * Get user by ID (Admin only)
   */
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<{ message: string; user: User }>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return response.data.user;
  },

  /**
   * Get my profile (logged in user)
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<{ message: string; user: User }>(
      API_ENDPOINTS.USERS.ME
    );
    return response.data.user;
  },

  /**
   * Update my profile (logged in user)
   */
  updateMe: async (data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<{ message: string; user: User }>(
      API_ENDPOINTS.USERS.ME,
      data
    );
    return response.data.user;
  },

  /**
   * Create new user (Admin only)
   */
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<{ message: string; user: User }>(
      API_ENDPOINTS.USERS.BASE,
      data
    );
    return response.data.user;
  },

  /**
   * Update user (Admin only)
   */
  update: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.patch<{ message: string; user: User }>(
      API_ENDPOINTS.USERS.BY_ID(id),
      data
    );
    return response.data.user;
  },

  /**
   * Delete user (Admin only)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  /**
   * Get user statistics (Admin only)
   */
  getStats: async (): Promise<{
    total: number;
    totalAdmins: number;
    totalUsers: number;
    recentUsers: User[];
  }> => {
    const response = await apiClient.get<{
      message: string;
      stats: {
        totalUsers: number;
        totalAdmins: number;
        totalUsersRegisteredThisMonth: number;
      };
    }>(API_ENDPOINTS.USERS.STATS);
    
    // Get all users to show recent ones
    const allUsersResponse = await apiClient.get<{ message: string; users: User[] }>(
      API_ENDPOINTS.USERS.BASE
    );
    
    const allUsers = allUsersResponse.data.users || [];
    const recentUsers = allUsers.slice(0, 5); // Get 5 most recent users
    
    return {
      total: response.data.stats.totalUsers,
      totalAdmins: response.data.stats.totalAdmins,
      totalUsers: response.data.stats.totalUsers - response.data.stats.totalAdmins,
      recentUsers,
    };
  },
};
