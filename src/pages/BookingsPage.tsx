import React, { useState } from 'react';
import type { Booking, BookingStatus, Customer, Service, Provider } from '../types';
import Modal from '../components/Modal';
import { BookingStatusBadge } from '../components/Controls';
import { bookingApi } from '../Services/BookingApi';

interface Props {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  customers: Customer[];
  services: Service[];
  providers: Provider[];
  isLoading: boolean;
  error: string;
}

const statusOptions: BookingStatus[] = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];

const BookingsPage: React.FC<Props> = ({ bookings, setBookings, customers, services, providers, isLoading, error }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<Booking | null>(null);

  const customerName = (booking: Booking) => booking.customerName ?? customers.find((c) => c.id === booking.customerId)?.name ?? 'Unknown';
  const serviceName = (booking: Booking) => booking.serviceName ?? services.find((s) => s.id === booking.serviceId)?.name ?? 'Unknown service';
  const providerName = (booking: Booking) => booking.providerId ? booking.providerName ?? providers.find((p) => p.id === booking.providerId)?.name ?? 'Unknown' : 'Unassigned';

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      customerName(b).toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      const updatedBooking = await bookingApi.updateStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedBooking } : b)));
      setActive((prev) => (prev && prev.id === id ? { ...prev, ...updatedBooking } : prev));
    } catch (error) {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      setActive((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Bookings</h1>
          <p className="page-sub">Every booking made across the customer app, with live status.</p>
        </div>
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search by code or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | BookingStatus)}>
          <option value="all">All statuses</option>
          {statusOptions.map((s) => <option value={s} key={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <span className="count-pill">{filtered.length} bookings</span>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Provider</th>
              <th>Schedule</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={8} className="empty-row">Loading bookings...</td></tr>
            )}
            {!isLoading && error && (
              <tr><td colSpan={8} className="empty-row">{error}</td></tr>
            )}
            {!isLoading && !error && filtered.map((b) => (
              <tr key={b.id}>
                <td className="mono">{b.bookingCode}</td>
                <td>{customerName(b)}</td>
                <td>{serviceName(b)}</td>
                <td>{providerName(b)}</td>
                <td>{b.scheduledDate} · {b.scheduledTime}</td>
                <td>₹ {b.amount}</td>
                <td><BookingStatusBadge status={b.status} /></td>
                <td><button className="btn btn-ghost" onClick={() => setActive(b)}>Manage</button></td>
              </tr>
            ))}
            {!isLoading && !error && filtered.length === 0 && (
              <tr><td colSpan={8} className="empty-row">No bookings match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <Modal title={`Booking ${active.bookingCode}`} onClose={() => setActive(null)} width={520}>
          <div className="detail-grid">
            <div><span className="muted">Customer</span><p>{customerName(active)}</p></div>
            <div><span className="muted">Service</span><p>{serviceName(active)}</p></div>
            <div><span className="muted">Provider</span><p>{providerName(active)}</p></div>
            <div><span className="muted">Schedule</span><p>{active.scheduledDate} · {active.scheduledTime}</p></div>
            <div><span className="muted">Amount</span><p>₹ {active.amount} ({active.paymentStatus})</p></div>
            <div><span className="muted">Address</span><p>{active.address}</p></div>
          </div>

          <label className="field">
            <span>Update status</span>
            <select
              className="input select"
              value={active.status}
              onChange={(e) => updateStatus(active.id, e.target.value as BookingStatus)}
            >
              {statusOptions.map((s) => <option value={s} key={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </label>

          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => setActive(null)}>Done</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookingsPage;
