"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Search, Edit, Trash2, Eye, X, Upload, ShoppingCart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productsService } from "@/lib/api/products.service";
import { productCategoriesService } from "@/lib/api/product-categories.service";
import { Product, ProductCategory } from "@/types/common";
import { toast } from "sonner";

interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image_url: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [stockFilter, setStockFilter] = useState<string>("ALL");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: "",
    image_url: "",
  });

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products when search or filters change
  useEffect(() => {
    filterProducts();
  }, [searchQuery, categoryFilter, stockFilter, products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsService.getAll();
      setProducts(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productCategoriesService.getAll();
      setCategories(response.data);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter((prod) => prod.categoryId === categoryFilter);
    }

    // Stock filter
    if (stockFilter === "IN_STOCK") {
      filtered = filtered.filter((prod) => prod.stock > 0);
    } else if (stockFilter === "OUT_OF_STOCK") {
      filtered = filtered.filter((prod) => prod.stock === 0);
    } else if (stockFilter === "LOW_STOCK") {
      filtered = filtered.filter((prod) => prod.stock > 0 && prod.stock <= 10);
    }

    setFilteredProducts(filtered);
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
      const result = await productsService.uploadImage(file);
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
      if (!formData.name || !formData.categoryId || formData.price <= 0) {
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

      await productsService.create({
        name: formData.name,
        description: formData.description || undefined,
        price: formData.price,
        stock: formData.stock,
        categoryId: formData.categoryId,
        image_url: imageUrl || undefined,
      });
      
      toast.success("Product created successfully");
      setShowCreateModal(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;

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
          imageUrl = selectedProduct.image_url || "";
        }
      }

      await productsService.update(selectedProduct.id, {
        name: formData.name,
        description: formData.description || undefined,
        price: formData.price,
        stock: formData.stock,
        categoryId: formData.categoryId,
        image_url: imageUrl || undefined,
      });
      
      toast.success("Product updated successfully");
      setShowEditModal(false);
      resetForm();
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await productsService.delete(selectedProduct.id);
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      image_url: product.image_url || "",
    });
    setImagePreview(product.image_url || "");
    setSelectedImage(null);
    setShowEditModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const openDetailModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      image_url: "",
    });
    setSelectedImage(null);
    setImagePreview("");
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Unknown";
  };

  const totalStock = products.reduce((sum, prod) => sum + prod.stock, 0);
  const outOfStock = products.filter(prod => prod.stock === 0).length;
  const lowStock = products.filter(prod => prod.stock > 0 && prod.stock <= 10).length;

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
        <Button 
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
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
              <p className="text-xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <ShoppingCart className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Stock</p>
              <p className="text-xl font-bold text-white">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Package className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Low Stock</p>
              <p className="text-xl font-bold text-white">{lowStock}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <Package className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Out of Stock</p>
              <p className="text-xl font-bold text-white">{outOfStock}</p>
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
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#1a1a1a] text-white">{cat.name}</option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
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
            <option value="ALL" className="bg-[#1a1a1a] text-white">All Stock</option>
            <option value="IN_STOCK" className="bg-[#1a1a1a] text-white">In Stock</option>
            <option value="LOW_STOCK" className="bg-[#1a1a1a] text-white">Low Stock (≤10)</option>
            <option value="OUT_OF_STOCK" className="bg-[#1a1a1a] text-white">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-white/10 bg-[#171717]">
          <Package className="mx-auto h-12 w-12 text-gray-600" />
          <h3 className="mt-4 text-lg font-semibold text-white">No products found</h3>
          <p className="mt-2 text-sm text-gray-400">
            {searchQuery || categoryFilter !== "ALL" || stockFilter !== "ALL"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first product"}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-white/10 bg-[#171717] p-5 hover:border-emerald-500/30 transition-all"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {getCategoryName(product.categoryId)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.stock === 0
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : product.stock <= 10
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {product.stock === 0 ? "Out of Stock" : `Stock: ${product.stock}`}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 mb-3">
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-lg font-bold text-emerald-400">Rp {product.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openDetailModal(product)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-white transition-colors py-2 rounded-lg hover:bg-white/5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </button>
                <button
                  onClick={() => openEditModal(product)}
                  className="flex-1 flex items-center justify-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors py-2 rounded-lg hover:bg-emerald-500/10"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(product)}
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
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Eco-Friendly Water Bottle"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the product..."
                  rows={3}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (Rp) *</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="50000"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stock *</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm hover:bg-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    appearance: 'none',
                  }}
                >
                  <option value="" className="bg-[#1a1a1a] text-white">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#1a1a1a] text-white">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
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
                {isUploadingImage ? 'Uploading...' : 'Create Product'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Similar structure to Create Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Product</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price (Rp)</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white text-sm hover:bg-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    appearance: 'none',
                  }}
                >
                  <option value="" className="bg-[#1a1a1a] text-white">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#1a1a1a] text-white">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
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
                {isUploadingImage ? 'Uploading...' : 'Update Product'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-md w-full">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-4">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Delete Product</h2>
              <p className="text-gray-400 mb-4">
                Are you sure you want to delete <span className="font-semibold text-white">{selectedProduct.name}</span>? This action cannot be undone.
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
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171717] rounded-xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Product Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedProduct.image_url && (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedProduct.name}</h3>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {getCategoryName(selectedProduct.categoryId)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProduct.stock === 0
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : selectedProduct.stock <= 10
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {selectedProduct.stock === 0 ? "Out of Stock" : `Stock: ${selectedProduct.stock}`}
                  </span>
                </div>
              </div>
              {selectedProduct.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <p className="text-white">{selectedProduct.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                  <p className="text-2xl font-bold text-emerald-400">Rp {selectedProduct.price.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                  <p className="text-2xl font-bold text-white">{selectedProduct.stock}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-400 mb-1">Created At</label>
                  <p className="text-white">{new Date(selectedProduct.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Updated At</label>
                  <p className="text-white">{new Date(selectedProduct.updatedAt).toLocaleString()}</p>
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
