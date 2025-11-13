"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CreditCard,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { dashboardService } from "@/lib/api";
import { DashboardStats, TransactionStatus } from "@/types/common";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboardService.getStats();
      setStats(data);
      console.log('Dashboard stats fetched:', data);
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchDashboardStats();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with K suffix
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Get transaction status badge color
  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PAID:
      case TransactionStatus.DELIVERED:
        return "bg-emerald-500/10 text-emerald-400";
      case TransactionStatus.PENDING:
        return "bg-yellow-500/10 text-yellow-400";
      case TransactionStatus.CANCELLED:
      case TransactionStatus.FAILED:
        return "bg-red-500/10 text-red-400";
      case TransactionStatus.PROCESSING:
      case TransactionStatus.SHIPPED:
        return "bg-blue-500/10 text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  // Calculate metrics
  const metrics = stats
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(stats.totalRevenue),
          change: stats.revenueGrowth ? `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth.toFixed(1)}%` : "+0%",
          trend: !stats.revenueGrowth || stats.revenueGrowth >= 0 ? "up" : "down",
          icon: CreditCard,
          description: stats.revenueGrowth ? "Trending this month" : "No change",
        },
        {
          title: "Total Users",
          value: formatNumber(stats.totalUsers),
          change: stats.userGrowth ? `${stats.userGrowth > 0 ? "+" : ""}${stats.userGrowth.toFixed(1)}%` : "+0%",
          trend: !stats.userGrowth || stats.userGrowth >= 0 ? "up" : "down",
          icon: Users,
          description: stats.userGrowth ? "User growth rate" : "No change",
        },
        {
          title: "Total Transactions",
          value: formatNumber(stats.totalTransactions),
          change: "+0%",
          trend: "up",
          icon: TrendingUp,
          description: "Total orders",
        },
        {
          title: "Products Listed",
          value: formatNumber(stats.totalProducts),
          change: "+0%",
          trend: "up",
          icon: Package,
          description: "Active products",
        },
      ]
    : [];

  const quickStats = stats
    ? [
        { label: "Waste Locations", value: stats.totalWasteLocations.toString(), icon: MapPin, color: "emerald" },
        { label: "Articles Published", value: stats.totalArticles.toString(), icon: FileText, color: "blue" },
        { label: "Products Listed", value: stats.totalProducts.toString(), icon: Package, color: "purple" },
        { label: "Active Users", value: formatNumber(stats.totalUsers), icon: Users, color: "orange" },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-400 mb-2">Failed to load dashboard</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Main Metrics - Horizontal Scroll on Mobile */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Key Metrics</h2>
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4 min-w-max sm:min-w-0">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.title}
                  className="w-64 sm:w-auto rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6 shadow-lg transition-all hover:border-emerald-500/30 hover:shadow-emerald-500/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                    </div>
                    <div
                      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        metric.trend === "up"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-400">
                      {metric.title}
                    </h3>
                    <p className="mt-2 text-xl sm:text-2xl font-bold text-white">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {metric.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Scroll Hint for Mobile */}
        <p className="text-xs text-gray-500 sm:hidden text-center">
          👈 Swipe to see more metrics
        </p>
      </div>

      {/* Quick Stats - Horizontal Scroll on Mobile */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Quick Stats</h2>
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4 min-w-max sm:min-w-0">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="w-48 sm:w-auto flex items-center gap-3 sm:gap-4 rounded-xl border border-white/10 bg-[#171717] p-3 sm:p-4"
                >
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 truncate">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Scroll Hint for Mobile */}
        <p className="text-xs text-gray-500 sm:hidden text-center">
          👈 Swipe to see all stats
        </p>
      </div>

      {/* Recent Activity Section - Responsive Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Transactions */}
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.slice(0, 4).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {transaction.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-emerald-400 shrink-0">
                      {formatCurrency(transaction.totalAmount)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
            Recent Users
          </h3>
          <div className="space-y-4">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.nama_panggilan}
                        className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.nama_panggilan.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{user.nama_panggilan}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      user.role === "ADMIN"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
