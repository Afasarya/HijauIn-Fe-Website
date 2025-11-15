"use client";

import { useState } from "react";
import { Users, UserPlus, Search, Loader2, Trash2, Edit, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers, useUsersStats } from "@/lib/hooks/useApi";
import { usersService } from "@/lib/api";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  
  // Fetch users with pagination and filters
  const { data: usersData, isLoading, error, refetch } = useUsers({
    page,
    limit: 10,
    search: search || undefined,
  });

  // Fetch user statistics
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useUsersStats();

  // Debug logs
  console.log('Users Data:', usersData);
  console.log('Users Stats:', stats);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await usersService.delete(id);
      refetch();
      refetchStats(); // Refresh stats after delete
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing data...');
    await Promise.all([refetch(), refetchStats()]);
  };

  // Filter users by role with proper null/undefined checks
  const filteredUsers = (usersData?.data ?? []).filter(user => {
    if (roleFilter === "ALL") return true;
    return user.role === roleFilter;
  });

  console.log('Filtered Users:', filteredUsers);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-400 mb-2">Failed to load users</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage all registered users and their permissions
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
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <UserPlus className="h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Users</p>
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
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Regular Users</p>
              <p className="text-xl font-bold text-white">
                {statsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                ) : (
                  (stats?.totalUsers ?? 0).toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Admins</p>
              <p className="text-xl font-bold text-white">
                {statsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                ) : (
                  (stats?.totalAdmins ?? 0).toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Recent</p>
              <p className="text-xl font-bold text-white">
                {statsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                ) : (
                  (stats?.recentUsers?.length ?? 0).toLocaleString()
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
              placeholder="Search users by name, email, or username..."
              className="pl-10 bg-white/5 border-white/10 text-white"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // Reset to first page on search
              }}
            />
          </div>
          <select 
            className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
              appearance: 'none',
            }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
          >
            <option value="ALL" className="bg-[#1a1a1a] text-white">All Roles</option>
            <option value="ADMIN" className="bg-[#1a1a1a] text-white">Admin</option>
            <option value="USER" className="bg-[#1a1a1a] text-white">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-white/10 bg-[#171717] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Username</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.nama_panggilan}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                              {user.nama_panggilan.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-medium text-white">{user.nama_panggilan}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">@{user.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN" 
                            ? "bg-purple-500/10 text-purple-400" 
                            : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
                            onClick={() => alert("Edit feature coming soon!")}
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </button>
                          <button 
                            className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {usersData && usersData.meta && usersData.meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, usersData.meta.total)} of {usersData.meta.total} users
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
                    Page {page} of {usersData.meta.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= usersData.meta.totalPages}
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
    </div>
  );
}
