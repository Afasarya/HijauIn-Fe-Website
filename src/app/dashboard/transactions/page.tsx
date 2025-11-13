"use client";

import { useState } from "react";
import { ShoppingCart, DollarSign, Clock, XCircle, Search, Loader2, Trash2, Eye, RefreshCw, Package, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactions, useTransactionsStats } from "@/lib/hooks/useApi";
import { transactionsService } from "@/lib/api";
import { TransactionStatus } from "@/types/common";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Fetch transactions with pagination and filters
  const { data: transactionsData, isLoading, error, refetch } = useTransactions({
    page,
    limit: 10,
    search: search || undefined,
  });

  // Fetch transaction statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useTransactionsStats();

  // Debug logs
  console.log('Transactions Data:', transactionsData);
  console.log('Transactions Stats:', stats);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to update status to ${newStatus}?`)) return;
    
    try {
      await transactionsService.updateStatus(id, newStatus);
      refetch();
      refetchStats();
      alert('Transaction status updated successfully!');
    } catch (error: any) {
      console.error("Update failed:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction? Only PENDING, FAILED, or CANCELLED transactions can be deleted.")) return;
    
    try {
      await transactionsService.delete(id);
      refetch();
      refetchStats();
      alert('Transaction deleted successfully!');
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Failed to delete transaction");
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing data...');
    await Promise.all([refetch(), refetchStats()]);
  };

  const handleViewDetail = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  // Filter transactions by status
  const filteredTransactions = (transactionsData?.data ?? []).filter(transaction => {
    if (statusFilter === "ALL") return true;
    return transaction.status === statusFilter;
  });

  // Format currency
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'DELIVERED':
        return 'bg-emerald-500/10 text-emerald-400';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'PROCESSING':
      case 'SHIPPED':
        return 'bg-blue-500/10 text-blue-400';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <DollarSign className="h-3 w-3" />;
      case 'PENDING':
        return <Clock className="h-3 w-3" />;
      case 'PROCESSING':
        return <Package className="h-3 w-3" />;
      case 'SHIPPED':
        return <Truck className="h-3 w-3" />;
      case 'DELIVERED':
        return <CheckCircle className="h-3 w-3" />;
      case 'CANCELLED':
      case 'FAILED':
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-400 mb-2">Failed to load transactions</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Transactions Management</h1>
          <p className="mt-2 text-sm text-gray-400">
            Monitor and manage all marketplace transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <ShoppingCart className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Transactions</p>
              <p className="text-xl font-bold text-white">
                {statsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                ) : (
                  (stats?.total ?? 0).toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-white">
                {statsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                ) : (
                  formatRupiah(stats?.totalRevenue ?? 0)
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Pending</p>
              <p className="text-xl font-bold text-white">
                {statsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                ) : (
                  (stats?.pending ?? 0).toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Paid</p>
              <p className="text-xl font-bold text-white">
                {statsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                ) : (
                  (stats?.paid ?? 0).toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="rounded-xl border border-white/10 bg-[#171717] p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by order number, user email, or status..."
              className="pl-10 bg-white/5 border-white/10 text-white"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <select 
            className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-white/10 bg-[#171717] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Loading transactions...</p>
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No transactions found</p>
            {search && (
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Order Number</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Total Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">{transaction.orderNumber}</span>
                          {transaction.midtransOrderId && (
                            <span className="text-xs text-gray-500">{transaction.midtransOrderId}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-white">{transaction.user?.nama_panggilan || 'Unknown'}</span>
                          <span className="text-xs text-gray-500">{transaction.user?.email || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {formatRupiah(transaction.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {transaction.items?.length || 0} item(s)
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                            onClick={() => handleViewDetail(transaction)}
                          >
                            <Eye className="h-3 w-3" />
                            Detail
                          </button>
                          {['PENDING', 'FAILED', 'CANCELLED'].includes(transaction.status) && (
                            <button 
                              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                              onClick={() => handleDelete(transaction.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {transactionsData && transactionsData.meta && transactionsData.meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, transactionsData.meta.total)} of {transactionsData.meta.total} transactions
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 rounded bg-white/5 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-400">
                    Page {page} of {transactionsData.meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= transactionsData.meta.totalPages}
                    className="px-3 py-1 rounded bg-white/5 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#171717] border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#171717] z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Transaction Detail</h2>
                <p className="text-sm text-gray-400 mt-1">{selectedTransaction.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div className="rounded-lg bg-white/5 p-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Update Status</label>
                <select 
                  className="w-full rounded-lg bg-[#0a0a0a] border border-white/20 px-4 py-3 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    appearance: 'none',
                  }}
                  value={selectedTransaction.status}
                  onChange={(e) => handleUpdateStatus(selectedTransaction.id, e.target.value)}
                >
                  <option value="PENDING" className="bg-[#0a0a0a] text-white">Pending</option>
                  <option value="PAID" className="bg-[#0a0a0a] text-white">Paid</option>
                  <option value="PROCESSING" className="bg-[#0a0a0a] text-white">Processing</option>
                  <option value="SHIPPED" className="bg-[#0a0a0a] text-white">Shipped</option>
                  <option value="DELIVERED" className="bg-[#0a0a0a] text-white">Delivered</option>
                  <option value="CANCELLED" className="bg-[#0a0a0a] text-white">Cancelled</option>
                  <option value="FAILED" className="bg-[#0a0a0a] text-white">Failed</option>
                </select>
              </div>

              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="text-white font-medium">{selectedTransaction.user?.nama_panggilan}</p>
                  <p className="text-sm text-gray-500">{selectedTransaction.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="text-white font-bold text-xl">{formatRupiah(selectedTransaction.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(selectedTransaction.status)}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    {selectedTransaction.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date</p>
                  <p className="text-white">{new Date(selectedTransaction.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-white font-medium mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedTransaction.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity} × {formatRupiah(item.productPrice)}</p>
                      </div>
                      <p className="text-white font-medium">{formatRupiah(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Detail */}
              {selectedTransaction.shippingDetail && (
                <div>
                  <h3 className="text-white font-medium mb-3">Shipping Information</h3>
                  <div className="bg-white/5 rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-sm text-gray-400">Recipient</p>
                      <p className="text-white">{selectedTransaction.shippingDetail.recipientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white">{selectedTransaction.shippingDetail.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Address</p>
                      <p className="text-white">{selectedTransaction.shippingDetail.address}</p>
                      <p className="text-sm text-gray-400">
                        {selectedTransaction.shippingDetail.city}, {selectedTransaction.shippingDetail.province} {selectedTransaction.shippingDetail.postalCode}
                      </p>
                    </div>
                    {selectedTransaction.shippingDetail.notes && (
                      <div>
                        <p className="text-sm text-gray-400">Notes</p>
                        <p className="text-white">{selectedTransaction.shippingDetail.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment URL */}
              {selectedTransaction.paymentUrl && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Payment URL</p>
                  <a 
                    href={selectedTransaction.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all"
                  >
                    {selectedTransaction.paymentUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
