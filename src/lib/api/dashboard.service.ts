import apiClient from './client';
import { DashboardStats } from '@/types/common';

/**
 * Dashboard Service
 * Handles dashboard statistics and aggregated data
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   * Aggregates data from multiple endpoints
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Fetch all stats in parallel for better performance
      const [usersRes, productsRes, transactionsRes, articlesRes, wasteLocationsRes] = 
        await Promise.allSettled([
          apiClient.get('/users/stats'),
          apiClient.get('/products/stats'),
          apiClient.get('/transactions/stats'),
          apiClient.get('/articles/stats'),
          apiClient.get('/waste-locations/stats'),
        ]);

      // Extract data with fallbacks
      const usersData = usersRes.status === 'fulfilled' ? usersRes.value.data : { total: 0, recentUsers: [] };
      const productsData = productsRes.status === 'fulfilled' ? productsRes.value.data : { total: 0 };
      const transactionsData = transactionsRes.status === 'fulfilled' ? transactionsRes.value.data : { 
        total: 0, 
        totalRevenue: 0, 
        recentTransactions: [] 
      };
      const articlesData = articlesRes.status === 'fulfilled' ? articlesRes.value.data : { total: 0 };
      const wasteLocationsData = wasteLocationsRes.status === 'fulfilled' ? wasteLocationsRes.value.data : { total: 0 };

      const stats: DashboardStats = {
        totalUsers: usersData.total || 0,
        totalProducts: productsData.total || 0,
        totalTransactions: transactionsData.total || 0,
        totalRevenue: transactionsData.totalRevenue || 0,
        totalArticles: articlesData.total || 0,
        totalWasteLocations: wasteLocationsData.total || 0,
        recentTransactions: transactionsData.recentTransactions || [],
        recentUsers: usersData.recentUsers || [],
        revenueGrowth: transactionsData.growth || 0,
        userGrowth: usersData.growth || 0,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return empty stats on error
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalTransactions: 0,
        totalRevenue: 0,
        totalArticles: 0,
        totalWasteLocations: 0,
        recentTransactions: [],
        recentUsers: [],
      };
    }
  },
};
