"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Search, Edit, Trash2, Eye, Filter, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { wasteLocationsService } from "@/lib/api/waste-locations.service";
import { WasteLocation, WasteCategory, CreateWasteLocationRequest, UpdateWasteLocationRequest, WasteLocationStats } from "@/types/waste-location";
import { toast } from "sonner";

export default function WasteLocationsPage() {
  const [locations, setLocations] = useState<WasteLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<WasteLocation[]>([]);
  const [stats, setStats] = useState<WasteLocationStats>({ total: 0, organik: 0, anorganik: 0, b3: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<WasteCategory | "ALL">("ALL");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<WasteLocation | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateWasteLocationRequest>({
    name: "",
    description: "",
    address: "",
    latitude: 0,
    longitude: 0,
    categories: [],
    image_url: "",
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchLocations();
    fetchStats();
  }, []);

  // Filter locations when search or category changes
  useEffect(() => {
    filterLocations();
  }, [searchQuery, categoryFilter, locations]);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const response = await wasteLocationsService.getAll();
      setLocations(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch waste locations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await wasteLocationsService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const filterLocations = () => {
    let filtered = [...locations];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter((loc) => loc.categories.includes(categoryFilter));
    }

    setFilteredLocations(filtered);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData({ ...formData, image_url: "" });
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploadingImage(true);
    try {
      console.log('Uploading image via service...');
      const result = await wasteLocationsService.uploadImage(file);
      console.log('Upload success:', result);
      return result.url;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (!formData.name || !formData.address || formData.categories.length === 0) {
        toast.error("Please fill all required fields");
        return;
      }

      // Upload image if selected
      let imageUrl = formData.image_url;
      if (selectedImage) {
        toast.loading("Uploading image...", { id: 'upload' });
        try {
          imageUrl = await uploadImage(selectedImage);
          toast.success("Image uploaded successfully", { id: 'upload' });
        } catch (error: any) {
          toast.error("Failed to upload image. Please try again or enter image URL manually.", { id: 'upload' });
          console.error('Upload failed:', error);
          return;
        }
      }

      // Validate image URL
      if (!imageUrl) {
        toast.error("Please upload an image or provide an image URL");
        return;
      }

      await wasteLocationsService.create({
        ...formData,
        image_url: imageUrl,
      });
      toast.success("Waste location created successfully");
      setShowCreateModal(false);
      resetForm();
      fetchLocations();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create waste location");
    }
  };

  const handleUpdate = async () => {
    if (!selectedLocation) return;

    try {
      // Upload image if new one selected
      let imageUrl = formData.image_url;
      if (selectedImage) {
        toast.loading("Uploading image...", { id: 'upload' });
        try {
          imageUrl = await uploadImage(selectedImage);
          toast.success("Image uploaded successfully", { id: 'upload' });
        } catch (error: any) {
          toast.error("Failed to upload image. Keeping previous image.", { id: 'upload' });
          console.error('Upload failed:', error);
          imageUrl = selectedLocation.image_url || "";
        }
      }

      const updateData: UpdateWasteLocationRequest = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        categories: formData.categories,
        image_url: imageUrl,
      };

      await wasteLocationsService.update(selectedLocation.id, updateData);
      toast.success("Waste location updated successfully");
      setShowEditModal(false);
      resetForm();
      setSelectedLocation(null);
      fetchLocations();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update waste location");
    }
  };

  const handleDelete = async () => {
    if (!selectedLocation) return;

    try {
      await wasteLocationsService.delete(selectedLocation.id);
      toast.success("Waste location deleted successfully");
      setShowDeleteModal(false);
      setSelectedLocation(null);
      fetchLocations();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete waste location");
    }
  };

  const openEditModal = (location: WasteLocation) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      description: location.description || "",
      address: location.address || "",
      latitude: location.latitude,
      longitude: location.longitude,
      categories: location.categories,
      image_url: location.image_url || "",
    });
    setImagePreview(location.image_url || "");
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (location: WasteLocation) => {
    setSelectedLocation(location);
    setShowDeleteModal(true);
  };

  const openDetailModal = (location: WasteLocation) => {
    setSelectedLocation(location);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      latitude: 0,
      longitude: 0,
      categories: [],
      image_url: "",
    });
    setSelectedImage(null);
    setImagePreview("");
  };

  const toggleCategory = (category: WasteCategory) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((c) => c !== category),
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      });
    }
  };

  const getCategoryColor = (category: WasteCategory) => {
    switch (category) {
      case WasteCategory.ORGANIK:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case WasteCategory.ANORGANIK:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case WasteCategory.B3:
        return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  const getCategoryIcon = (category: WasteCategory) => {
    switch (category) {
      case WasteCategory.ORGANIK:
        return "🌿";
      case WasteCategory.ANORGANIK:
        return "♻️";
      case WasteCategory.B3:
        return "☢️";
    }
  };

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
        <Button 
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
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
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Organik</p>
              <p className="text-xl font-bold text-white">{stats.organik}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <span className="text-xl">♻️</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Anorganik</p>
              <p className="text-xl font-bold text-white">{stats.anorganik}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <span className="text-xl">☢️</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">B3 (Berbahaya)</p>
              <p className="text-xl font-bold text-white">{stats.b3}</p>
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
              placeholder="Search locations by name, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as WasteCategory | "ALL")}
            className="rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
              appearance: 'none',
            }}
          >
            <option value="ALL" className="bg-[#1a1a1a] text-white">All Categories</option>
            <option value={WasteCategory.ORGANIK} className="bg-[#1a1a1a] text-white">🌿 Organik</option>
            <option value={WasteCategory.ANORGANIK} className="bg-[#1a1a1a] text-white">♻️ Anorganik</option>
            <option value={WasteCategory.B3} className="bg-[#1a1a1a] text-white">☢️ B3</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading locations...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredLocations.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-white/10 bg-[#171717]">
          <MapPin className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">No locations found</h3>
          <p className="mt-2 text-sm text-gray-400">
            {searchQuery || categoryFilter !== "ALL"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first waste location"}
          </p>
        </div>
      )}

      {/* Locations Grid */}
      {!isLoading && filteredLocations.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <div
              key={location.id}
              className="rounded-xl border border-white/10 bg-[#171717] p-5 hover:border-emerald-500/30 transition-all"
            >
              {location.image_url && (
                <img
                  src={location.image_url}
                  alt={location.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="flex gap-1">
                  {location.categories.map((cat) => (
                    <span
                      key={cat}
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(cat)}`}
                    >
                      {getCategoryIcon(cat)}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{location.name}</h3>
              {location.description && (
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{location.description}</p>
              )}
              <p className="text-xs text-gray-500 mb-3">📍 {location.address || "No address"}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/10 mb-3">
                <span className="text-xs text-gray-500">
                  Lat: <span className="text-white">{location.latitude.toFixed(4)}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Lng: <span className="text-white">{location.longitude.toFixed(4)}</span>
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openDetailModal(location)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-white transition-colors py-2 rounded-lg hover:bg-white/5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(location)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors py-2 rounded-lg hover:bg-emerald-500/10"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(location)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors py-2 rounded-lg hover:bg-red-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Add New Waste Location</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., TPS Kampus UMP"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the waste location..."
                  rows={3}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Latitude *</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    placeholder="-7.4291"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Longitude *</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    placeholder="109.2320"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Categories * (Select at least one)</label>
                <div className="flex gap-2">
                  {Object.values(WasteCategory).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.categories.includes(cat)
                          ? getCategoryColor(cat) + " border-current"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {getCategoryIcon(cat)} {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-black/50 rounded-full p-1 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Create Location
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedLocation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Waste Location</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
                <div className="flex gap-2">
                  {Object.values(WasteCategory).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.categories.includes(cat)
                          ? getCategoryColor(cat) + " border-current"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {getCategoryIcon(cat)} {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload-edit"
                  />
                  <label
                    htmlFor="image-upload-edit"
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-black/50 rounded-full p-1 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <Button
                onClick={() => setShowEditModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Update Location
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedLocation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-4">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Waste Location</h2>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete <span className="font-semibold text-white">{selectedLocation.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedLocation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Location Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedLocation.image_url && (
                <img
                  src={selectedLocation.image_url}
                  alt={selectedLocation.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedLocation.name}</h3>
                <div className="flex gap-2 mb-4">
                  {selectedLocation.categories.map((cat) => (
                    <span
                      key={cat}
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(cat)}`}
                    >
                      {getCategoryIcon(cat)} {cat}
                    </span>
                  ))}
                </div>
              </div>
              {selectedLocation.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <p className="text-white">{selectedLocation.description}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <p className="text-white">{selectedLocation.address || "No address provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Latitude</label>
                  <p className="text-white font-mono">{selectedLocation.latitude}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Longitude</label>
                  <p className="text-white font-mono">{selectedLocation.longitude}</p>
                </div>
              </div>
              {selectedLocation.user && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Created By</label>
                  <p className="text-white">{selectedLocation.user.nama_panggilan} (@{selectedLocation.user.username})</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Created At</label>
                  <p className="text-white">{new Date(selectedLocation.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Updated At</label>
                  <p className="text-white">{new Date(selectedLocation.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10">
              <Button onClick={() => setShowDetailModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
