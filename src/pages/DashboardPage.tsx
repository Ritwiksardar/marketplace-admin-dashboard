import React from 'react';
import type { Booking, Customer, Provider, Service } from '../types';
import { BookingStatusBadge } from '../components/Controls';

interface Props {
  bookings: Booking[];
  customers: Customer[];
  providers: Provider[];
  services: Service[];
}

const DashboardPage: React.FC<Props> = ({ bookings, customers, providers, services }) => {
  const formatCurrency = (value: number) => `₹ ${Number(value || 0).toLocaleString()}`;

  const totalRevenue = bookings
    .filter((b) => {
      const payment = String(b.paymentStatus ?? '').toLowerCase();
      const status = String(b.status ?? '').toLowerCase();
      return payment === 'paid' || payment === 'completed' || status === 'completed';
    })
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const pendingApprovals = providers.filter((p) => p.approvalStatus === 'pending').length;
  const unassigned = bookings.filter((b) => !b.providerId && b.status !== 'cancelled').length;
  const activeProviders = providers.filter((p) => p.status === 'active').length;

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? 'Unknown service';
  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? 'Unknown';

  const recent = [...bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6);

  const stats = [
    { label: 'Total bookings', value: bookings.length, hint: `${unassigned} awaiting a provider` },
    { label: 'Revenue collected', value: formatCurrency(totalRevenue), hint: 'From paid bookings' },
    { label: 'Active providers', value: activeProviders, hint: `${pendingApprovals} pending approval` },
    { label: 'Customers', value: customers.length, hint: `${customers.filter(c => c.status === 'active').length} active` },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="page-sub">A quick snapshot of how the platform is running today.</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-hint">{s.hint}</div>
          </div>
        ))}
      </div>

      <div className="table-card">
        <div className="table-card-head">
          <h3>Recent bookings</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Schedule</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((b) => (
              <tr key={b.id}>
                <td className="mono">{b.bookingCode}</td>
                <td>{customerName(b.customerId)}</td>
                <td>{serviceName(b.serviceId)}</td>
                <td>{b.scheduledDate} · {b.scheduledTime}</td>
                <td>₹ {b.amount}</td>
                <td><BookingStatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
