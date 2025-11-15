/**
 * Waste Location Types
 * Type definitions for waste locations (Loka/Tong Sampah)
 */

export enum WasteCategory {
  ORGANIK = 'ORGANIK',
  ANORGANIK = 'ANORGANIK',
  B3 = 'B3',
}

export interface WasteLocation {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  latitude: number;
  longitude: number;
  categories: WasteCategory[];
  image_url?: string | null;
  createdBy: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    nama_panggilan: string;
    username: string;
    email: string;
  };
}

export interface CreateWasteLocationRequest {
  name: string;
  description?: string;
  address?: string;
  latitude: number;
  longitude: number;
  categories: WasteCategory[];
  image_url?: string;
}

export interface UpdateWasteLocationRequest {
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  categories?: WasteCategory[];
  image_url?: string;
}

export interface WasteLocationResponse {
  message: string;
  data: WasteLocation;
}

export interface WasteLocationsResponse {
  message: string;
  count: number;
  filters?: {
    categories?: WasteCategory[];
  };
  data: WasteLocation[];
}

export interface WasteLocationStats {
  total: number;
  organik: number;
  anorganik: number;
  b3: number;
}
