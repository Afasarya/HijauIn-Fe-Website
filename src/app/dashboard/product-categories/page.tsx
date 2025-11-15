"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Search, Edit, Trash2, Eye, X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productCategoriesService } from "@/lib/api/product-categories.service";
import { ProductCategory } from "@/types/common";
import { toast } from "sonner";

interface FormData {
  name: string;
  description: string;
  image_url: string;
}

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    image_url: "",
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories when search changes
  useEffect(() => {
    filterCategories();
  }, [searchQuery, categories]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await productCategoriesService.getAll();
      setCategories(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = [...categories];

    if (searchQuery) {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
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
      const result = await productCategoriesService.uploadImage(file);
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
      if (!formData.name) {
        toast.error("Please fill all required fields");
        return;
      }

      let imageUrl = formData.image_url;
      if (selectedImage) {
        toast.loading("Uploading image...", { id: 'upload' });
        try {
          imageUrl = await uploadImage(selectedImage);
          toast.success("Image uploaded successfully", { id: 'upload' });
        } catch (error: any) {
          toast.error("Failed to upload image", { id: 'upload' });
          console.error('Upload failed:', error);
          return;
        }
      }

      await productCategoriesService.create({
        name: formData.name,
        description: formData.description || undefined,
        image_url: imageUrl || undefined,
      });
      
      toast.success("Category created successfully");
      setShowCreateModal(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  const handleUpdate = async () => {
    if (!selectedCategory) return;

    try {
      let imageUrl = formData.image_url;
      if (selectedImage) {
        toast.loading("Uploading image...", { id: 'upload' });
        try {
          imageUrl = await uploadImage(selectedImage);
          toast.success("Image uploaded successfully", { id: 'upload' });
        } catch (error: any) {
          toast.error("Failed to upload image. Keeping previous image.", { id: 'upload' });
          console.error('Upload failed:', error);
          imageUrl = selectedCategory.image_url || "";
        }
      }

      await productCategoriesService.update(selectedCategory.id, {
        name: formData.name,
        description: formData.description || undefined,
        image_url: imageUrl || undefined,
      });
      
      toast.success("Category updated successfully");
      setShowEditModal(false);
      resetForm();
      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      await productCategoriesService.delete(selectedCategory.id);
      toast.success("Category deleted successfully");
      setShowDeleteModal(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const openEditModal = (category: ProductCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
    });
    setImagePreview(category.image_url || "");
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (category: ProductCategory) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const openDetailModal = (category: ProductCategory) => {
    setSelectedCategory(category);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image_url: "",
    });
    setSelectedImage(null);
    setImagePreview("");
  };

  const totalProducts = categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Product Categories</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage product categories for your marketplace
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
          Add New Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Package className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Categories</p>
              <p className="text-xl font-bold text-white">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Products</p>
              <p className="text-xl font-bold text-white">{totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <ImageIcon className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">With Images</p>
              <p className="text-xl font-bold text-white">
                {categories.filter(cat => cat.image_url).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-white/10 bg-[#171717] p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading categories...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCategories.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-white/10 bg-[#171717]">
          <Package className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">No categories found</h3>
          <p className="mt-2 text-sm text-gray-400">
            {searchQuery
              ? "Try adjusting your search"
              : "Get started by adding your first category"}
          </p>
        </div>
      )}

      {/* Categories Grid */}
      {!isLoading && filteredCategories.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-white/10 bg-[#171717] p-5 hover:border-emerald-500/30 transition-all"
            >
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Package className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {category._count?.products || 0} products
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{category.description}</p>
              )}
              <div className="flex gap-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => openDetailModal(category)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-white transition-colors py-2 rounded-lg hover:bg-white/5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(category)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors py-2 rounded-lg hover:bg-emerald-500/10"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(category)}
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
              <h2 className="text-xl font-bold text-white">Add New Category</h2>
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
                  placeholder="e.g., Personal Care"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the category..."
                  rows={3}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm"
                />
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
              <Button 
                onClick={handleCreate} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isUploadingImage}
              >
                {isUploadingImage ? 'Uploading...' : 'Create Category'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Category</h2>
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
              <Button 
                onClick={handleUpdate} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isUploadingImage}
              >
                {isUploadingImage ? 'Uploading...' : 'Update Category'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-4">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Category</h2>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete <span className="font-semibold text-white">{selectedCategory.name}</span>? 
                {selectedCategory._count && selectedCategory._count.products > 0 && (
                  <span className="block mt-2 text-red-400">
                    This category has {selectedCategory._count.products} product(s). You cannot delete it until all products are removed or moved to another category.
                  </span>
                )}
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
              <Button 
                onClick={handleDelete} 
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={selectedCategory._count && selectedCategory._count.products > 0}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Category Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedCategory.image_url && (
                <img
                  src={selectedCategory.image_url}
                  alt={selectedCategory.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedCategory.name}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {selectedCategory._count?.products || 0} products
                </span>
              </div>
              {selectedCategory.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <p className="text-white">{selectedCategory.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Created At</label>
                  <p className="text-white">{new Date(selectedCategory.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Updated At</label>
                  <p className="text-white">{new Date(selectedCategory.updatedAt).toLocaleString()}</p>
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