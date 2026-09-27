import apiClient from './client';
import type { Category, Service } from '../types';

interface CategoryApiRecord {
  id?: string;
  category_id?: string;
  name?: string;
  description?: string;
  isActive?: boolean;
  status?: boolean | string;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
}

interface ServiceApiRecord {
  id?: string;
  name?: string;
  description?: string;
  basePrice?: number;
  price?: number;
  duration?: number | string;
  isActive?: boolean;
  status?: boolean | string;
  image?: string;
  category_id?: string;
  categoryId?: string;
  category?: { id?: string; name?: string };
  createdAt?: string;
  updatedAt?: string;
}

const toCategory = (item: CategoryApiRecord): Category => ({
  id: item.id ?? item.category_id ?? `cat-${Date.now()}`,
  name: item.name ?? 'Untitled category',
  image: item.image ?? `https://picsum.photos/seed/${item.id ?? item.category_id ?? 'category'}/200/200`,
  status: item.isActive === false || item.status === false || item.status === 'inactive' ? 'inactive' : 'active',
  subCategoryCount: 0,
  createdAt: item.createdAt ?? new Date().toISOString().slice(0, 10),
});

const toService = (item: ServiceApiRecord): Service => ({
  id: item.id ?? `srv-${Date.now()}`,
  subCategoryId: item.category_id ?? item.categoryId ?? item.category?.id ?? '',
  name: item.name ?? 'Untitled service',
  image: item.image ?? `https://picsum.photos/seed/${item.id ?? 'service'}/200/200`,
  price: Number(item.basePrice ?? item.price ?? 0),
  duration: typeof item.duration === 'number' ? `${item.duration} min` : (item.duration ?? '1 hr'),
  description: item.description ?? '',
  status: item.isActive === false || item.status === false || item.status === 'inactive' ? 'inactive' : 'active',
});

const extractArray = <T>(payload: Record<string, unknown>, key: string): T[] => {
  const value = payload[key];
  if (Array.isArray(value)) return value as T[];
  if (Array.isArray((payload.data as Record<string, unknown> | undefined)?.[key])) {
    return ((payload.data as Record<string, unknown>)?.[key] as T[]) ?? [];
  }
  return [];
};

export const catalogApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<{ success?: boolean; categories?: CategoryApiRecord[]; data?: { categories?: CategoryApiRecord[] } }>('/categories/all');
    const items = extractArray<CategoryApiRecord>(response.data as Record<string, unknown>, 'categories');
    return items.map(toCategory);
  },

  getServices: async (): Promise<Service[]> => {
    const response = await apiClient.get<{ success?: boolean; services?: ServiceApiRecord[]; data?: { services?: ServiceApiRecord[] } }>('/services');
    const items = extractArray<ServiceApiRecord>(response.data as Record<string, unknown>, 'services');
    return items.map(toService);
  },

  createCategory: async (payload: { name: string; description?: string; isActive?: boolean; image?: string }) => {
    return apiClient.post('/categories', payload);
  },

  updateCategory: async (id: string, payload: { name?: string; description?: string; isActive?: boolean; image?: string }) => {
    return apiClient.patch(`/categories/${id}`, payload);
  },

  deleteCategory: async (id: string) => {
    return apiClient.delete(`/categories/${id}`);
  },

  createService: async (payload: { name: string; description?: string; basePrice?: number; duration?: number | string; isActive?: boolean; image?: string; category_id?: string; categoryId?: string }) => {
    return apiClient.post('/services', payload);
  },

  updateService: async (id: string, payload: { name?: string; description?: string; basePrice?: number; duration?: number | string; isActive?: boolean; image?: string; category_id?: string; categoryId?: string }) => {
    return apiClient.patch(`/services/${id}`, payload);
  },

  deleteService: async (id: string) => {
    return apiClient.delete(`/services/${id}`);
  },
};

export default catalogApi;
