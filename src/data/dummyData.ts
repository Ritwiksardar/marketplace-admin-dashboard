import type {
  Category,
  SubCategory,
  Service,
  Banner,
  Provider,
  Customer,
  Booking,
} from '../types';

const img = (seed: string) =>
  `https://picsum.photos/seed/${seed}/200/200`;

export const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Home Cleaning', image: img('cleaning'), status: 'active', subCategoryCount: 3, createdAt: '2026-01-12' },
  { id: 'cat-2', name: 'Electrician', image: img('electric'), status: 'active', subCategoryCount: 2, createdAt: '2026-01-15' },
  { id: 'cat-3', name: 'Plumbing', image: img('plumb'), status: 'active', subCategoryCount: 2, createdAt: '2026-01-18' },
  { id: 'cat-4', name: 'Beauty & Spa', image: img('beauty'), status: 'active', subCategoryCount: 3, createdAt: '2026-02-02' },
  { id: 'cat-5', name: 'Appliance Repair', image: img('appliance'), status: 'inactive', subCategoryCount: 1, createdAt: '2026-02-20' },
];

export const initialSubCategories: SubCategory[] = [
  { id: 'sub-1', categoryId: 'cat-1', name: 'Deep Cleaning', image: img('deepclean'), status: 'active', createdAt: '2026-01-13' },
  { id: 'sub-2', categoryId: 'cat-1', name: 'Bathroom Cleaning', image: img('bathclean'), status: 'active', createdAt: '2026-01-13' },
  { id: 'sub-3', categoryId: 'cat-1', name: 'Sofa Shampooing', image: img('sofa'), status: 'inactive', createdAt: '2026-01-14' },
  { id: 'sub-4', categoryId: 'cat-2', name: 'Wiring & Fitting', image: img('wiring'), status: 'active', createdAt: '2026-01-16' },
  { id: 'sub-5', categoryId: 'cat-2', name: 'Switch & Socket', image: img('switch'), status: 'active', createdAt: '2026-01-16' },
  { id: 'sub-6', categoryId: 'cat-3', name: 'Tap & Pipe Repair', image: img('tap'), status: 'active', createdAt: '2026-01-19' },
  { id: 'sub-7', categoryId: 'cat-3', name: 'Bathroom Fitting', image: img('bathfit'), status: 'active', createdAt: '2026-01-19' },
  { id: 'sub-8', categoryId: 'cat-4', name: 'Salon for Women', image: img('salonw'), status: 'active', createdAt: '2026-02-03' },
  { id: 'sub-9', categoryId: 'cat-4', name: 'Salon for Men', image: img('salonm'), status: 'active', createdAt: '2026-02-03' },
  { id: 'sub-10', categoryId: 'cat-4', name: 'Spa & Massage', image: img('spa'), status: 'active', createdAt: '2026-02-04' },
];

export const initialServices: Service[] = [
  { id: 'srv-1', subCategoryId: 'sub-1', name: '2 BHK Deep Cleaning', image: img('2bhk'), price: 1499, duration: '3 hrs', description: 'Complete deep cleaning for 2BHK homes including kitchen and bathrooms.', status: 'active' },
  { id: 'srv-2', subCategoryId: 'sub-1', name: '3 BHK Deep Cleaning', image: img('3bhk'), price: 2199, duration: '4.5 hrs', description: 'Complete deep cleaning for 3BHK homes including kitchen and bathrooms.', status: 'active' },
  { id: 'srv-3', subCategoryId: 'sub-2', name: 'Bathroom Deep Clean', image: img('bathdeep'), price: 499, duration: '1 hr', description: 'Tile, tap and floor deep cleaning for one bathroom.', status: 'active' },
  { id: 'srv-4', subCategoryId: 'sub-4', name: 'Ceiling Fan Installation', image: img('fan'), price: 299, duration: '45 min', description: 'Installation of ceiling fan including wiring check.', status: 'active' },
  { id: 'srv-5', subCategoryId: 'sub-5', name: 'Switch Board Replacement', image: img('board'), price: 199, duration: '30 min', description: 'Replace a faulty switch board with a new one.', status: 'active' },
  { id: 'srv-6', subCategoryId: 'sub-6', name: 'Tap Leakage Repair', image: img('leak'), price: 249, duration: '40 min', description: 'Fix leaking taps in kitchen or bathroom.', status: 'active' },
  { id: 'srv-7', subCategoryId: 'sub-8', name: "Women's Haircut & Styling", image: img('haircut'), price: 599, duration: '1 hr', description: 'Haircut and styling at home by a certified stylist.', status: 'active' },
  { id: 'srv-8', subCategoryId: 'sub-10', name: 'Full Body Massage', image: img('massage'), price: 1299, duration: '1.5 hrs', description: 'Relaxing full body massage at your home.', status: 'inactive' },
];

export const initialBanners: Banner[] = [
  { id: 'ban-1', title: 'Monsoon Cleaning Offer - 30% Off', image: img('banner1'), linkType: 'category', linkId: 'cat-1', order: 1, status: 'active' },
  { id: 'ban-2', title: 'Flat 20% Off on Electrician Visits', image: img('banner2'), linkType: 'category', linkId: 'cat-2', order: 2, status: 'active' },
  { id: 'ban-3', title: 'New: Spa & Massage at Home', image: img('banner3'), linkType: 'service', linkId: 'srv-8', order: 3, status: 'active' },
  { id: 'ban-4', title: 'Festive Beauty Package', image: img('banner4'), linkType: 'category', linkId: 'cat-4', order: 4, status: 'inactive' },
];

export const initialProviders: Provider[] = [
  {
    id: 'prov-1', name: 'Arif Hossain', email: 'arif.hossain@example.com', phone: '+880 1711-223344',
    avatar: img('arif'), categoryIds: ['cat-1'], rating: 4.7, totalBookings: 128,
    approvalStatus: 'approved', joinedAt: '2026-01-20', status: 'active',
    documents: [
      { type: 'National ID', fileUrl: '/docs/arif-nid.pdf', status: 'verified' },
      { type: 'Police Verification', fileUrl: '/docs/arif-pv.pdf', status: 'verified' },
    ],
  },
  {
    id: 'prov-2', name: 'Sumaiya Akter', email: 'sumaiya.akter@example.com', phone: '+880 1822-334455',
    avatar: img('sumaiya'), categoryIds: ['cat-4'], rating: 4.9, totalBookings: 210,
    approvalStatus: 'approved', joinedAt: '2026-01-25', status: 'active',
    documents: [
      { type: 'National ID', fileUrl: '/docs/sumaiya-nid.pdf', status: 'verified' },
      { type: 'Training Certificate', fileUrl: '/docs/sumaiya-cert.pdf', status: 'verified' },
    ],
  },
  {
    id: 'prov-3', name: 'Rakibul Islam', email: 'rakibul.islam@example.com', phone: '+880 1933-445566',
    avatar: img('rakibul'), categoryIds: ['cat-2'], rating: 0, totalBookings: 0,
    approvalStatus: 'pending', joinedAt: '2026-08-30', status: 'inactive',
    documents: [
      { type: 'National ID', fileUrl: '/docs/rakibul-nid.pdf', status: 'pending' },
      { type: 'Trade License', fileUrl: '/docs/rakibul-license.pdf', status: 'pending' },
    ],
  },
  {
    id: 'prov-4', name: 'Mitu Rahman', email: 'mitu.rahman@example.com', phone: '+880 1644-556677',
    avatar: img('mitu'), categoryIds: ['cat-3'], rating: 0, totalBookings: 0,
    approvalStatus: 'pending', joinedAt: '2026-09-01', status: 'inactive',
    documents: [
      { type: 'National ID', fileUrl: '/docs/mitu-nid.pdf', status: 'verified' },
      { type: 'Police Verification', fileUrl: '/docs/mitu-pv.pdf', status: 'pending' },
    ],
  },
  {
    id: 'prov-5', name: 'Jahidul Karim', email: 'jahidul.karim@example.com', phone: '+880 1555-667788',
    avatar: img('jahidul'), categoryIds: ['cat-1', 'cat-3'], rating: 4.2, totalBookings: 76,
    approvalStatus: 'rejected', joinedAt: '2026-07-14', status: 'inactive',
    documents: [
      { type: 'National ID', fileUrl: '/docs/jahidul-nid.pdf', status: 'rejected' },
    ],
  },
  {
    id: 'prov-6', name: 'Nusrat Jahan', email: 'nusrat.jahan@example.com', phone: '+880 1766-778899',
    avatar: img('nusrat'), categoryIds: ['cat-4'], rating: 4.5, totalBookings: 54,
    approvalStatus: 'approved', joinedAt: '2026-03-11', status: 'active',
    documents: [
      { type: 'National ID', fileUrl: '/docs/nusrat-nid.pdf', status: 'verified' },
    ],
  },
];

export const initialCustomers: Customer[] = [
  { id: 'cus-1', name: 'Tanvir Ahmed', email: 'tanvir.ahmed@example.com', phone: '+880 1911-112233', avatar: img('tanvir'), totalBookings: 14, totalSpent: 18650, joinedAt: '2025-11-02', status: 'active' },
  { id: 'cus-2', name: 'Farzana Yasmin', email: 'farzana.y@example.com', phone: '+880 1812-223344', avatar: img('farzana'), totalBookings: 8, totalSpent: 9200, joinedAt: '2025-12-19', status: 'active' },
  { id: 'cus-3', name: 'Shakil Chowdhury', email: 'shakil.c@example.com', phone: '+880 1713-334455', avatar: img('shakil'), totalBookings: 3, totalSpent: 2450, joinedAt: '2026-02-08', status: 'active' },
  { id: 'cus-4', name: 'Ruma Begum', email: 'ruma.begum@example.com', phone: '+880 1614-445566', avatar: img('ruma'), totalBookings: 21, totalSpent: 31200, joinedAt: '2025-08-27', status: 'active' },
  { id: 'cus-5', name: 'Imran Khalid', email: 'imran.khalid@example.com', phone: '+880 1515-556677', avatar: img('imran'), totalBookings: 1, totalSpent: 499, joinedAt: '2026-08-20', status: 'inactive' },
];

export const initialBookings: Booking[] = [
  { id: 'bk-1', bookingCode: 'SH-100231', customerId: 'cus-1', serviceId: 'srv-1', providerId: 'prov-1', scheduledDate: '2026-09-07', scheduledTime: '10:00 AM', address: 'House 12, Road 5, Dhanmondi, Dhaka', amount: 1499, status: 'assigned', paymentStatus: 'paid', createdAt: '2026-09-05' },
  { id: 'bk-2', bookingCode: 'SH-100232', customerId: 'cus-2', serviceId: 'srv-7', providerId: 'prov-2', scheduledDate: '2026-09-06', scheduledTime: '2:00 PM', address: 'Flat 3B, Gulshan Avenue, Dhaka', amount: 599, status: 'in_progress', paymentStatus: 'paid', createdAt: '2026-09-04' },
  { id: 'bk-3', bookingCode: 'SH-100233', customerId: 'cus-3', serviceId: 'srv-6', scheduledDate: '2026-09-08', scheduledTime: '11:30 AM', address: 'House 4, Sector 9, Uttara, Dhaka', amount: 249, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-09-05' },
  { id: 'bk-4', bookingCode: 'SH-100234', customerId: 'cus-4', serviceId: 'srv-2', providerId: 'prov-1', scheduledDate: '2026-09-03', scheduledTime: '9:00 AM', address: 'House 22, Banani, Dhaka', amount: 2199, status: 'completed', paymentStatus: 'paid', createdAt: '2026-09-01' },
  { id: 'bk-5', bookingCode: 'SH-100235', customerId: 'cus-1', serviceId: 'srv-4', scheduledDate: '2026-09-09', scheduledTime: '4:00 PM', address: 'House 12, Road 5, Dhanmondi, Dhaka', amount: 299, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-09-06' },
  { id: 'bk-6', bookingCode: 'SH-100236', customerId: 'cus-5', serviceId: 'srv-3', scheduledDate: '2026-09-02', scheduledTime: '1:00 PM', address: 'Road 11, Bashundhara, Dhaka', amount: 499, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2026-08-30' },
  { id: 'bk-7', bookingCode: 'SH-100237', customerId: 'cus-2', serviceId: 'srv-8', scheduledDate: '2026-09-10', scheduledTime: '5:30 PM', address: 'Flat 3B, Gulshan Avenue, Dhaka', amount: 1299, status: 'pending', paymentStatus: 'unpaid', createdAt: '2026-09-06' },
  { id: 'bk-8', bookingCode: 'SH-100238', customerId: 'cus-4', serviceId: 'srv-5', providerId: 'prov-3', scheduledDate: '2026-09-04', scheduledTime: '3:00 PM', address: 'House 22, Banani, Dhaka', amount: 199, status: 'completed', paymentStatus: 'paid', createdAt: '2026-09-02' },
];
