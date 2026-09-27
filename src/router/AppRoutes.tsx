import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { Banner, Booking, Category, Customer, PageKey, Provider, Service, SubCategory } from '../types';
import { bookingApi } from '../api/bookingApi';
import { catalogApi } from '../api/catalogApi';
import { providerApi } from '../api/providerApi';
import { useAppDispatch, useAppSelector, logout } from '../store';
import LoginPage from '../pages/LoginPage';
import Sidebar from '../components/Sidebar';
import DashboardPage from '../pages/DashboardPage';
import CategoriesPage from '../pages/CategoriesPage';
import SubCategoriesPage from '../pages/SubCategoriesPage';
import ServicesPage from '../pages/ServicesPage';
import BannersPage from '../pages/BannersPage';
import BookingsPage from '../pages/BookingsPage';
import AssignServicePage from '../pages/AssignServicePage';
import ProviderApprovalPage from '../pages/ProviderApprovalPage';
import ProvidersPage from '../pages/ProvidersPage';
import CustomersPage from '../pages/CustomersPage';

const pageTitles: Record<PageKey, string> = {
  dashboard: 'Dashboard',
  categories: 'Categories',
  subCategories: 'Sub-categories',
  services: 'Services',
  banners: 'Banners',
  bookings: 'Bookings',
  assignService: 'Assign provider',
  providerApproval: 'Provider approval',
  providers: 'Providers',
  customers: 'Customers',
};

const pagePaths: Record<PageKey, string> = {
  dashboard: '/dashboard',
  categories: '/categories',
  subCategories: '/sub-categories',
  services: '/services',
  banners: '/banners',
  bookings: '/bookings',
  assignService: '/assign-service',
  providerApproval: '/provider-approval',
  providers: '/providers',
  customers: '/customers',
};

const deriveSubCategoriesFromCategories = (categories: Category[]): SubCategory[] =>
  categories.map((category) => ({
    id: category.id,
    categoryId: category.id,
    name: category.name,
    image: category.image,
    status: category.status,
    createdAt: category.createdAt,
  }));

const deriveCustomersFromBookings = (bookings: Booking[]) => {
  const grouped = new Map<string, { id: string; name: string; email: string; phone: string; totalBookings: number; totalSpent: number; joinedAt: string; status: 'active' | 'inactive'; avatar: string; }>();

  bookings.forEach((booking) => {
    const existing = grouped.get(booking.customerId) ?? {
      id: booking.customerId,
      name: booking.customerName ?? 'Unknown customer',
      email: `${booking.customerName ?? 'customer'}@servicehub.local`,
      phone: '',
      totalBookings: 0,
      totalSpent: 0,
      joinedAt: booking.createdAt,
      status: 'active',
      avatar: `https://picsum.photos/seed/${booking.customerId}/200/200`,
    };

    existing.totalBookings += 1;
    existing.totalSpent += booking.amount;
    existing.name = booking.customerName ?? existing.name;

    grouped.set(booking.customerId, existing);
  });

  return Array.from(grouped.values()).map((customer) => ({
    ...customer,
    totalSpent: customer.totalSpent,
    joinedAt: customer.joinedAt.slice(0, 10),
  }));
};

const AppShell: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 900);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setIsSidebarOpen(false);
        return;
      }

      setIsSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    const loadCatalog = async () => {
      try {
        const [categoryResult, serviceResult] = await Promise.all([
          catalogApi.getCategories(),
          catalogApi.getServices(),
        ]);

        if (isMounted) {
          setCategories(categoryResult);
          setSubCategories(deriveSubCategoriesFromCategories(categoryResult));
          setServices(serviceResult);
        }
      } catch (error) {
        console.error('Failed to load catalog:', error);
      }
    };

    const loadProviders = async () => {
      try {
        const result = await providerApi.list();
        if (isMounted) {
          setProviders(result);
        }
      } catch (error) {
        console.error('Failed to load providers:', error);
      }
    };

    void loadCatalog();
    void loadProviders();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (categories.length > 0) {
      setSubCategories(deriveSubCategoriesFromCategories(categories));
    }
  }, [categories, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const bookingAwarePaths = ['/dashboard', '/bookings', '/assign-service', '/customers'];
    const isBookingPage = bookingAwarePaths.includes(location.pathname);
    if (!isBookingPage) return;

    let isMounted = true;

    const loadBookings = async () => {
      setIsBookingLoading(true);
      setBookingError('');

      try {
        const response = await bookingApi.list();
        if (isMounted) {
          setBookings(response);
          setCustomers(deriveCustomersFromBookings(response));
        }
      } catch (error) {
        if (isMounted) {
          setBookings([]);
          setCustomers([]);
          setBookingError('Unable to load bookings. Check the API connection and try again.');
          console.error('Failed to load bookings:', error);
        }
      } finally {
        if (isMounted) {
          setIsBookingLoading(false);
        }
      }
    };

    void loadBookings();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, location.pathname]);

  const pendingApprovals = useMemo(() => providers.filter((p) => p.approvalStatus === 'pending').length, [providers]);
  const pendingAssign = useMemo(
    () => bookings.filter((b) => !b.providerId && b.status !== 'cancelled' && b.status !== 'completed').length,
    [bookings]
  );

  const currentPage = (Object.entries(pagePaths).find(([, path]) => path === location.pathname)?.[0] ?? 'dashboard') as PageKey;

  const handleLogin = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleNavigate = (pageKey: PageKey) => {
    navigate(pagePaths[pageKey]);
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage bookings={bookings} customers={customers} providers={providers} services={services} />;
      case 'categories':
        return <CategoriesPage categories={categories} setCategories={setCategories} />;
      case 'subCategories':
        return <SubCategoriesPage categories={categories} subCategories={subCategories} setSubCategories={setSubCategories} />;
      case 'services':
        return <ServicesPage subCategories={subCategories} services={services} setServices={setServices} />;
      case 'banners':
        return <BannersPage banners={banners} setBanners={setBanners} categories={categories} services={services} />;
      case 'bookings':
        return <BookingsPage bookings={bookings} setBookings={setBookings} customers={customers} services={services} providers={providers} isLoading={isBookingLoading} error={bookingError} />;
      case 'assignService':
        return <AssignServicePage bookings={bookings} setBookings={setBookings} customers={customers} services={services} providers={providers} isLoading={isBookingLoading} error={bookingError} />;
      case 'providerApproval':
        return <ProviderApprovalPage providers={providers} setProviders={setProviders} />;
      case 'providers':
        return <ProvidersPage providers={providers} setProviders={setProviders} categories={categories} />;
      case 'customers':
        return <CustomersPage customers={customers} setCustomers={setCustomers} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        active={currentPage}
        onNavigate={handleNavigate}
        pendingApprovals={pendingApprovals}
        pendingAssign={pendingAssign}
        isCollapsed={!isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        onLogout={handleLogout}
        userName={user?.name ?? 'Admin User'}
        userRole={user?.role ?? user?.email ?? 'Super Admin'}
      />
      <div className="app-main">
        <header className="topbar">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            ☰
          </button>
          <div className="topbar-title">{pageTitles[currentPage]}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="topbar-search">
              <input className="input" placeholder="Search anything..." />
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleLogout}
              title="Sign out"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="app-content">
          {isBookingLoading && currentPage === 'dashboard' ? (
            <div className="page">
              <div className="page-head">
                <div>
                  <h1>Loading bookings…</h1>
                </div>
              </div>
            </div>
          ) : null}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={renderPage()} />
            <Route path="/categories" element={renderPage()} />
            <Route path="/sub-categories" element={renderPage()} />
            <Route path="/services" element={renderPage()} />
            <Route path="/banners" element={renderPage()} />
            <Route path="/bookings" element={renderPage()} />
            <Route path="/assign-service" element={renderPage()} />
            <Route path="/provider-approval" element={renderPage()} />
            <Route path="/providers" element={renderPage()} />
            <Route path="/customers" element={renderPage()} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default AppRoutes;
