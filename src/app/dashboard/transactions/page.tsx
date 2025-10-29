import { CreditCard, Download, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TransactionsPage() {
  const transactions = [
    { id: "TRX-001", user: "John Doe", amount: 150000, type: "Deposit", status: "Success", date: "2025-10-29" },
    { id: "TRX-002", user: "Jane Smith", amount: 75000, type: "Withdrawal", status: "Pending", date: "2025-10-29" },
    { id: "TRX-003", user: "Bob Johnson", amount: 200000, type: "Deposit", status: "Success", date: "2025-10-28" },
    { id: "TRX-004", user: "Alice Brown", amount: 50000, type: "Payment", status: "Failed", date: "2025-10-28" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Transactions Management</h1>
          <p className="mt-2 text-sm text-gray-400">
            Monitor and manage all financial transactions
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CreditCard className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-white">Rp 45.2M</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <CreditCard className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">This Month</p>
              <p className="text-xl font-bold text-white">Rp 8.3M</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <CreditCard className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Pending</p>
              <p className="text-xl font-bold text-white">234</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <CreditCard className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Failed</p>
              <p className="text-xl font-bold text-white">12</p>
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
              placeholder="Search transactions..."
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
            <option>All Types</option>
            <option>Deposit</option>
            <option>Withdrawal</option>
            <option>Payment</option>
          </select>
          <select className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
            <option>All Status</option>
            <option>Success</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border border-white/10 bg-[#171717] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-white">{trx.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{trx.user}</td>
                  <td className="px-6 py-4 text-sm font-medium text-white">Rp {trx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                      {trx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trx.status === "Success" 
                        ? "bg-emerald-500/10 text-emerald-400"
                        : trx.status === "Pending"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{trx.date}</td>
                  <td className="px-6 py-4">
                    <button className="text-emerald-400 hover:text-emerald-300 text-sm">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
