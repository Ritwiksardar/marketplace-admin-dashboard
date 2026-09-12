export type ID = string;
export type ActiveStatus = 'active' | 'inactive';

export interface Category {
  id: ID;
  name: string;
  image: string;
  status: ActiveStatus;
  subCategoryCount: number;
  createdAt: string;
}

export interface SubCategory {
  id: ID;
  categoryId: ID;
  name: string;
  image: string;
  status: ActiveStatus;
  createdAt: string;
}

export interface Service {
  id: ID;
  subCategoryId: ID;
  name: string;
  image: string;
  price: number;
  duration: string;
  description: string;
  status: ActiveStatus;
}

export type BannerLinkType = 'category' | 'service' | 'none';

export interface Banner {
  id: ID;
  title: string;
  image: string;
  linkType: BannerLinkType;
  linkId?: ID;
  order: number;
  status: ActiveStatus;
}

export type ProviderApprovalStatus = 'pending' | 'approved' | 'rejected';
export type DocumentStatus = 'pending' | 'verified' | 'rejected';

export interface ProviderDocument {
  type: string;
  fileUrl: string;
  status: DocumentStatus;
}

export interface Provider {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  categoryIds: ID[];
  rating: number;
  totalBookings: number;
  approvalStatus: ProviderApprovalStatus;
  documents: ProviderDocument[];
  joinedAt: string;
  status: ActiveStatus;
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalBookings: number;
  totalSpent: number;
  joinedAt: string;
  status: ActiveStatus;
}

export type BookingStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';

export interface Booking {
  id: ID;
  bookingCode: string;
  customerId: ID;
  serviceId: ID;
  providerId?: ID;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export type PageKey =
  | 'dashboard'
  | 'categories'
  | 'subCategories'
  | 'services'
  | 'banners'
  | 'bookings'
  | 'assignService'
  | 'providerApproval'
  | 'providers'
  | 'customers';
