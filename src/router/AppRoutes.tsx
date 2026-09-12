import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { PageKey } from '../types';
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
import {
  initialCategories,
  initialSubCategories,
  initialServices,
  initialBanners,
  initialProviders,
  initialCustomers,
  initialBookings,
} from '../data/dummyData';

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

const AppShell: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('auth_token')));
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 900);
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

  const [categories, setCategories] = useState(initialCategories);
  const [subCategories, setSubCategories] = useState(initialSubCategories);
  const [services, setServices] = useState(initialServices);
  const [banners, setBanners] = useState(initialBanners);
  const [providers, setProviders] = useState(initialProviders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [bookings, setBookings] = useState(initialBookings);

  const pendingApprovals = providers.filter((p) => p.approvalStatus === 'pending').length;
  const pendingAssign = bookings.filter((b) => !b.providerId && b.status !== 'cancelled' && b.status !== 'completed').length;

  const currentPage = (Object.entries(pagePaths).find(([, path]) => path === location.pathname)?.[0] ?? 'dashboard') as PageKey;

  const handleLogin = () => {
    localStorage.setItem('auth_token', 'servicehub-admin');
    setIsAuthenticated(true);
    navigate('/dashboard', { replace: true });
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
        return <BookingsPage bookings={bookings} setBookings={setBookings} customers={customers} services={services} providers={providers} />;
      case 'assignService':
        return <AssignServicePage bookings={bookings} setBookings={setBookings} customers={customers} services={services} providers={providers} />;
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
          <div className="topbar-search">
            <input className="input" placeholder="Search anything..." />
          </div>
        </header>
        <main className="app-content">
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
