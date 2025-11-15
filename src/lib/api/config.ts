/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

// Base API URL from environment variable
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.mentorit.my.id',
  TIMEOUT: 30000, // 30 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VALIDATE_TOKEN: '/auth/validate-reset-token',
  },
  
  // Users endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me',
    STATS: '/users/stats',
  },
  
  // Products endpoints
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    UPLOAD: '/products/upload',
    STATS: '/products/stats',
    CATEGORIES: '/products/categories',
  },
  
  // Product Categories endpoints
  PRODUCT_CATEGORIES: {
    BASE: '/product-categories',
    BY_ID: (id: string) => `/product-categories/${id}`,
    UPLOAD: '/product-categories/upload',
  },
  
  // Transactions endpoints
  TRANSACTIONS: {
    BASE: '/transactions',
    BY_ID: (id: string) => `/transactions/${id}`,
    STATS: '/transactions/stats',
    BY_USER: (userId: string) => `/transactions/user/${userId}`,
    CHECKOUT: '/transactions/checkout',
    CHECK_STATUS: (id: string) => `/transactions/${id}/check-status`,
    UPDATE_STATUS: (id: string) => `/transactions/${id}/status`,
  },
  
  // Articles endpoints
  ARTICLES: {
    BASE: '/articles',
    BY_ID: (id: string) => `/articles/${id}`,
    BY_SLUG: (slug: string) => `/articles/slug/${slug}`,
    UPLOAD: '/articles/upload',
    STATS: '/articles/stats',
    PUBLIC: '/public/articles',
    PUBLIC_BY_SLUG: (slug: string) => `/public/articles/${slug}`,
  },
  
  // Waste Locations endpoints
  WASTE_LOCATIONS: {
    BASE: '/waste-locations',
    BY_ID: (id: string) => `/waste-locations/${id}`,
    UPLOAD: '/waste-locations/upload',
    STATS: '/waste-locations/stats',
    PUBLIC: '/loka',
    NEARBY: '/loka/nearby',
  },
  
  // Cart endpoints
  CART: {
    BASE: '/cart',
    ITEMS: '/cart/items',
    ITEM_BY_ID: (itemId: string) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
} as const;
