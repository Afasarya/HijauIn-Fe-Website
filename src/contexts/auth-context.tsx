"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/auth.service';
import { tokenStorage } from '@/lib/auth/token';
import { AuthContextType, LoginRequest, RegisterRequest, User } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = tokenStorage.getToken();
      const storedUser = tokenStorage.getUser();

      if (token && storedUser) {
        // Verify token is still valid by fetching profile
        try {
          const { user: profileUser } = await authService.getProfile();
          setUser(profileUser);
          tokenStorage.setUser(profileUser); // Update stored user data
        } catch (error) {
          // Token is invalid, clear auth
          tokenStorage.clearAuth();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      tokenStorage.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authService.login(credentials);
      
      // Save token and user data
      tokenStorage.setToken(response.access_token);
      tokenStorage.setUser(response.user);
      setUser(response.user);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      
      // Save token and user data
      tokenStorage.setToken(response.access_token);
      tokenStorage.setUser(response.user);
      setUser(response.user);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API call success
      tokenStorage.clearAuth();
      setUser(null);
      router.push('/login');
    }
  };

  const refreshProfile = async () => {
    try {
      const { user: profileUser } = await authService.getProfile();
      setUser(profileUser);
      tokenStorage.setUser(profileUser);
    } catch (error) {
      console.error('Refresh profile error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

