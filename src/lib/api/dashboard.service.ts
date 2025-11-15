import apiClient from './client';
import { DashboardStats } from '@/types/common';

/**
 * Dashboard Service
 * Handles dashboard statistics and aggregated data
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   * Aggregates data from multiple endpoints that actually exist
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      console.log('Fetching dashboard stats...');
      
      // Fetch all data in parallel - HANYA menggunakan endpoint yang benar-benar ada
      const [usersRes, transactionsRes, productsRes, articlesRes, wasteLocationsRes] = 
        await Promise.allSettled([
          apiClient.get('/users'),
          apiClient.get('/transactions/admin/all'),
          apiClient.get('/products'),
          apiClient.get('/articles'),
          apiClient.get('/waste-locations'),
        ]);

      console.log('API Responses:', { usersRes, transactionsRes, productsRes, articlesRes, wasteLocationsRes });

      // Extract data dengan format yang benar dari setiap endpoint
      const usersData = usersRes.status === 'fulfilled' ? usersRes.value.data.users : [];
      const transactionsData = transactionsRes.status === 'fulfilled' ? transactionsRes.value.data.data : [];
      const productsData = productsRes.status === 'fulfilled' ? productsRes.value.data.data : [];
      const articlesData = articlesRes.status === 'fulfilled' ? articlesRes.value.data.data : [];
      const wasteLocationsData = wasteLocationsRes.status === 'fulfilled' ? wasteLocationsRes.value.data.data : [];

      // Calculate totals
      const totalUsers = Array.isArray(usersData) ? usersData.length : 0;
      const totalTransactions = Array.isArray(transactionsData) ? transactionsData.length : 0;
      const totalProducts = Array.isArray(productsData) ? productsData.length : 0;
      const totalArticles = Array.isArray(articlesData) ? articlesData.length : 0;
      const totalWasteLocations = Array.isArray(wasteLocationsData) ? wasteLocationsData.length : 0;

      // Calculate total revenue from PAID transactions
      const totalRevenue = Array.isArray(transactionsData) 
        ? transactionsData
            .filter((t: any) => t.status === 'PAID' || t.status === 'DELIVERED')
            .reduce((sum: number, t: any) => sum + (t.totalAmount || 0), 0)
        : 0;

      // Get recent transactions (sorted by date)
      const recentTransactions = Array.isArray(transactionsData)
        ? transactionsData
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        : [];

      // Get recent users (sorted by date)
      const recentUsers = Array.isArray(usersData)
        ? usersData
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        : [];

      const stats: DashboardStats = {
        totalUsers,
        totalProducts,
        totalTransactions,
        totalRevenue,
        totalArticles,
        totalWasteLocations,
        recentTransactions,
        recentUsers,
      };

      console.log('Dashboard stats compiled:', stats);
      return stats;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      console.error('Error details:', error.response?.data);
      
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
