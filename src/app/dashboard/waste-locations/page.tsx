import { MapPin, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WasteLocationsPage() {
  const locations = [
    { id: 1, name: "TPS Sudirman", address: "Jl. Sudirman No. 123, Jakarta", type: "TPS", capacity: "85%", status: "Active" },
    { id: 2, name: "TPA Bantar Gebang", address: "Bekasi, Jawa Barat", type: "TPA", capacity: "92%", status: "Active" },
    { id: 3, name: "Bank Sampah Melati", address: "Jl. Melati No. 45, Bandung", type: "Bank Sampah", capacity: "45%", status: "Active" },
    { id: 4, name: "TPS Gatot Subroto", address: "Jl. Gatot Subroto, Jakarta", type: "TPS", capacity: "78%", status: "Maintenance" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Lokasi Sampah</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage waste collection points and recycling centers
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Add New Location
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <MapPin className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Locations</p>
              <p className="text-xl font-bold text-white">156</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">TPS</p>
              <p className="text-xl font-bold text-white">89</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <MapPin className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Bank Sampah</p>
              <p className="text-xl font-bold text-white">45</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <MapPin className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">TPA</p>
              <p className="text-xl font-bold text-white">22</p>
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
              placeholder="Search locations..."
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
            <option>All Types</option>
            <option>TPS</option>
            <option>TPA</option>
            <option>Bank Sampah</option>
          </select>
          <select className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Maintenance</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <div key={location.id} className="rounded-xl border border-white/10 bg-[#171717] p-5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <MapPin className="h-5 w-5 text-emerald-400" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                location.status === "Active" 
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}>
                {location.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{location.name}</h3>
            <p className="text-sm text-gray-400 mb-3">{location.address}</p>
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-xs text-gray-500">Type: <span className="text-emerald-400">{location.type}</span></span>
              <span className="text-xs text-gray-500">Capacity: <span className="text-white font-semibold">{location.capacity}</span></span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 text-sm text-gray-400 hover:text-white transition-colors">View</button>
              <button className="flex-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
