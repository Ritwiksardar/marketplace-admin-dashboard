import React, { useState } from 'react';
import type { Booking, Customer, Provider, Service } from '../types';
import Modal from '../components/Modal';
import { BookingStatusBadge } from '../components/Controls';

interface Props {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  customers: Customer[];
  services: Service[];
  providers: Provider[];
}

const AssignServicePage: React.FC<Props> = ({ bookings, setBookings, customers, services, providers }) => {
  const [active, setActive] = useState<Booking | null>(null);
  const [chosenProvider, setChosenProvider] = useState<string>('');

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? 'Unknown';
  const service = (id: string) => services.find((s) => s.id === id);

  const unassigned = bookings.filter((b) => !b.providerId && b.status !== 'cancelled' && b.status !== 'completed');

  const eligibleProviders = (booking: Booking) => {
    const svc = service(booking.serviceId);
    if (!svc) return providers.filter((p) => p.approvalStatus === 'approved' && p.status === 'active');
    return providers.filter(
      (p) =>
        p.approvalStatus === 'approved' &&
        p.status === 'active'
    );
  };

  const openAssign = (b: Booking) => {
    setActive(b);
    setChosenProvider('');
  };

  const confirmAssign = () => {
    if (!active || !chosenProvider) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === active.id ? { ...b, providerId: chosenProvider, status: 'assigned' } : b))
    );
    setActive(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Assign provider</h1>
          <p className="page-sub">Match new bookings with an available, approved provider.</p>
        </div>
      </div>

      <div className="toolbar">
        <span className="count-pill">{unassigned.length} bookings waiting for a provider</span>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Schedule</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {unassigned.map((b) => {
              const svc = service(b.serviceId);
              return (
                <tr key={b.id}>
                  <td className="mono">{b.bookingCode}</td>
                  <td>{customerName(b.customerId)}</td>
                  <td>{svc?.name ?? 'Unknown service'}</td>
                  <td>{b.scheduledDate} · {b.scheduledTime}</td>
                  <td><BookingStatusBadge status={b.status} /></td>
                  <td><button className="btn btn-primary btn-sm" onClick={() => openAssign(b)}>Assign provider</button></td>
                </tr>
              );
            })}
            {unassigned.length === 0 && (
              <tr><td colSpan={6} className="empty-row">All bookings currently have a provider assigned.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <Modal title={`Assign provider · ${active.bookingCode}`} onClose={() => setActive(null)} width={520}>
          <p className="muted" style={{ marginBottom: 12 }}>
            Service: <strong>{service(active.serviceId)?.name}</strong> on {active.scheduledDate} at {active.scheduledTime}
          </p>
          <div className="provider-pick-list">
            {eligibleProviders(active).map((p) => (
              <label className={`provider-pick ${chosenProvider === p.id ? 'provider-pick-active' : ''}`} key={p.id}>
                <input
                  type="radio"
                  name="provider"
                  value={p.id}
                  checked={chosenProvider === p.id}
                  onChange={() => setChosenProvider(p.id)}
                />
                <img src={p.avatar} alt="" />
                <div>
                  <div className="provider-pick-name">{p.name}</div>
                  <div className="muted">★ {p.rating || 'New'} · {p.totalBookings} jobs completed</div>
                </div>
              </label>
            ))}
            {eligibleProviders(active).length === 0 && (
              <p className="empty-row">No approved, active providers are available for this category yet.</p>
            )}
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setActive(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={confirmAssign} disabled={!chosenProvider}>Confirm assignment</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AssignServicePage;
