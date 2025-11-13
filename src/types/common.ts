/**
 * Common Types
 * Shared type definitions across the application
 */

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API Response
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
}

// Statistics
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalTransactions: number;
  totalRevenue: number;
  totalArticles: number;
  totalWasteLocations: number;
  recentTransactions: Transaction[];
  recentUsers: User[];
  revenueGrowth?: number;
  userGrowth?: number;
}

// User Types
export interface User {
  id: string;
  nama_panggilan: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar_url?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  nama_panggilan: string;
  username: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
  avatar_url?: string;
}

export interface UpdateUserRequest {
  nama_panggilan?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
  avatar_url?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  image_url?: string | null;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: ProductCategory;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  categoryId: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  image_url?: string;
  categoryId?: string;
}

// Product Category Types
export interface ProductCategory {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
  _count?: {
    products: number;
  };
}

export interface CreateProductCategoryRequest {
  name: string;
  description?: string;
  image_url?: string;
}

export interface UpdateProductCategoryRequest {
  name?: string;
  description?: string;
  image_url?: string;
}

// Transaction Types
export enum TransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export interface Transaction {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  status: TransactionStatus;
  paymentUrl?: string | null;
  midtransOrderId?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  items?: TransactionItem[];
  shippingDetail?: ShippingDetail;
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
}

export interface ShippingDetail {
  id: string;
  transactionId: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  recipientName: string;
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface CheckoutResponse {
  message: string;
  transaction: Transaction;
  paymentUrl: string;
}

// Article Types
export interface Article {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string | null;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export interface CreateArticleRequest {
  title: string;
  thumbnailUrl?: string;
  content: string;
}

export interface UpdateArticleRequest {
  title?: string;
  thumbnailUrl?: string;
  content?: string;
}

// Waste Location Types
export enum WasteCategory {
  ORGANIK = 'ORGANIK',
  ANORGANIK = 'ANORGANIK',
  B3 = 'B3',
}

export interface WasteLocation {
  id: string;
  name: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  address?: string | null;
  image_url?: string | null;
  createdBy: string;
  created_at: string;
  updated_at: string;
  user?: User;
  categories?: WasteLocationCategory[];
}

export interface WasteLocationCategory {
  id: string;
  wasteLocationId: string;
  category: WasteCategory;
}

export interface CreateWasteLocationRequest {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  image_url?: string;
  categories: WasteCategory[];
}

export interface UpdateWasteLocationRequest {
  name?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  image_url?: string;
  categories?: WasteCategory[];
}

// Cart Types
export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
