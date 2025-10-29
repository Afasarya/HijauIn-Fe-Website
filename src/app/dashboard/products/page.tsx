import { Package, Plus, Search, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductsPage() {
  const products = [
    { id: 1, name: "Tas Belanja Ramah Lingkungan", category: "Accessories", price: 45000, stock: 120, status: "Available" },
    { id: 2, name: "Botol Minum Stainless", category: "Drinkware", price: 85000, stock: 45, status: "Available" },
    { id: 3, name: "Sedotan Bambu Set 4pcs", category: "Kitchenware", price: 25000, stock: 0, status: "Out of Stock" },
    { id: 4, name: "Tas Daur Ulang Premium", category: "Accessories", price: 120000, stock: 78, status: "Available" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Product Management</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage eco-friendly products in the marketplace
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Package className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Products</p>
              <p className="text-xl font-bold text-white">234</p>
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
              <p className="text-xl font-bold text-white">Rp 12.5M</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Package className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Available</p>
              <p className="text-xl font-bold text-white">189</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Package className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Out of Stock</p>
              <p className="text-xl font-bold text-white">45</p>
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
              placeholder="Search products..."
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
            <option>All Categories</option>
            <option>Accessories</option>
            <option>Drinkware</option>
            <option>Kitchenware</option>
          </select>
          <select className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
            <option>All Status</option>
            <option>Available</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-white/10 bg-[#171717] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Product Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Price</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-emerald-400" />
                      </div>
                      <span className="text-sm font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white">Rp {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === "Available" 
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-white text-sm">Edit</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </div>
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
