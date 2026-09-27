import apiClient from './client';
import type { Provider } from '../types';

interface ServiceProviderRecord {
  service_provider?: {
    id?: string;
    userId?: string;
    isVerified?: boolean;
    providerStatus?: string;
  };
  users?: {
    id?: string;
    username?: string;
    email?: string;
    mobile?: string;
    photo?: string;
    isActive?: boolean;
  };
  approvalStatus?: Provider['approvalStatus'];
  status?: Provider['status'];
}

export const providerApi = {
  list: async (): Promise<Provider[]> => {
    const response = await apiClient.get<{ success?: boolean; serviceProviders?: ServiceProviderRecord[] }>('/service-providers');
    const items = response.data.serviceProviders ?? [];

    return items.map((provider) => {
      const serviceProvider = provider.service_provider;
      const user = provider.users;

      return {
        id: serviceProvider?.id ?? user?.id ?? '',
        name: user?.username ?? 'Unknown provider',
        email: user?.email ?? '',
        phone: user?.mobile ?? '',
        avatar: user?.photo ?? `https://picsum.photos/seed/${serviceProvider?.id ?? user?.id ?? 'provider'}/200/200`,
        categoryIds: [],
        rating: 0,
        totalBookings: 0,
        approvalStatus: provider.approvalStatus ?? (serviceProvider?.isVerified === false ? 'pending' : 'approved'),
        documents: [],
        joinedAt: '',
        status: provider.status ?? (user?.isActive === false || serviceProvider?.providerStatus === 'offline' ? 'inactive' : 'active'),
      };
    });
  },
};

export default providerApi;
