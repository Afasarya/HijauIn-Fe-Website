/**
 * Token Storage Utilities
 * Handles JWT token storage in localStorage
 */

const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';

export const tokenStorage = {
  /**
   * Save access token to localStorage
   */
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Get access token from localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  /**
   * Remove access token from localStorage
   */
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Save user data to localStorage
   */
  setUser: (user: any): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  /**
   * Get user data from localStorage
   */
  getUser: (): any | null => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  /**
   * Remove user data from localStorage
   */
  removeUser: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Clear all auth data
   */
  clearAuth: (): void => {
    tokenStorage.removeToken();
    tokenStorage.removeUser();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!tokenStorage.getToken();
  },
};

