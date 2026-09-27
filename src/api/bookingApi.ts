import apiClient from './client';
import type { Booking, BookingStatus } from '../types';

interface BookingApiRecord {
  booking: {
    id: string;
    customerId: string;
    serviceId: string;
    providerId?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    totalAmount?: number;
    paymentStatus?: string;
    bookingStatus?: string;
    created_at?: string;
  };
  customer?: { username?: string; email?: string };
  service?: { name?: string };
  provider?: { username?: string; email?: string };
  address?: {
    house_number?: string;
    street_no_or_name?: string;
    city?: string;
    state?: string;
    pin_code?: string;
    country?: string;
  };
}

const statusMap: Record<string, Booking['status']> = {
  pending: 'pending',
  requested: 'pending',
  accepted: 'assigned',
  assigned: 'assigned',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
};

const paymentStatusMap: Record<string, Booking['paymentStatus']> = {
  completed: 'paid',
  paid: 'paid',
  pending: 'unpaid',
  unpaid: 'unpaid',
  refunded: 'refunded',
};

const normalizeDate = (value?: string) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString().slice(0, 10);
};

const formatAddress = (address?: BookingApiRecord['address']) => {
  if (!address) return 'Address unavailable';

  return [
    address.house_number,
    address.street_no_or_name,
    address.city,
    address.state,
    address.pin_code,
    address.country,
  ].filter(Boolean).join(', ');
};

const normalizeBooking = (record: BookingApiRecord): Booking => {
  const booking = record.booking;

  return {
    id: booking.id,
    bookingCode: booking.id.slice(0, 8).toUpperCase(),
    customerId: booking.customerId,
    serviceId: booking.serviceId,
    providerId: booking.providerId,
    scheduledDate: normalizeDate(booking.scheduledDate),
    scheduledTime: booking.scheduledTime ?? 'Not specified',
    address: formatAddress(record.address),
    amount: Number(booking.totalAmount ?? 0),
    status: statusMap[booking.bookingStatus ?? 'pending'] ?? 'pending',
    paymentStatus: paymentStatusMap[booking.paymentStatus ?? 'unpaid'] ?? 'unpaid',
    createdAt: booking.created_at ?? new Date().toISOString(),
    customerName: record.customer?.username ?? record.customer?.email ?? 'Unknown customer',
    serviceName: record.service?.name ?? 'Unknown service',
    providerName: record.provider?.username ?? record.provider?.email ?? 'Unknown provider',
  };
};

const backendStatusMap: Record<BookingStatus, string> = {
  pending: 'requested',
  assigned: 'accepted',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
};

export const bookingApi = {
  list: async (): Promise<Booking[]> => {
    const response = await apiClient.get<{ success?: boolean; bookings?: BookingApiRecord[] }>('/admin/bookings/all');
    const bookings = response.data.bookings ?? [];
    return bookings.map(normalizeBooking);
  },

  getById: async (bookingId: string): Promise<Booking> => {
    const response = await apiClient.get<BookingApiRecord>(`/admin/bookings/${bookingId}`);
    return normalizeBooking(response.data);
  },

  updateStatus: async (bookingId: string, status: BookingStatus): Promise<Booking> => {
    const response = await apiClient.patch<BookingApiRecord>('/bookings/assign', {
      bookingId,
      status: backendStatusMap[status] ?? status,
    });

    return normalizeBooking(response.data);
  },

  assignProvider: async (bookingId: string, providerId: string): Promise<void> => {
    await apiClient.patch('/bookings/assign', {
      bookingId,
      providerId,
      status: 'accepted',
    });
  },

  getAllServicesProviders: async () => {
    const response = await apiClient.get<{ success?: boolean; serviceProviders?: Array<any> }>('/service-providers');
    return response.data.serviceProviders ?? [];
  },
};

export const getAllServicesProviders = async () => {
  const response = await apiClient.get<{ success?: boolean; serviceProviders?: Array<any> }>('/service-providers');
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
};

export default bookingApi;
