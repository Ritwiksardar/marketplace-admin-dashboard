import React, { useEffect, useState } from 'react';
import type { Booking, Customer, Provider, Service } from '../types';
import Modal from '../components/Modal';
import { BookingStatusBadge } from '../components/Controls';
import { bookingApi, getAllServicesProviders } from '../Services/BookingApi';

interface Props {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  customers: Customer[];
  services: Service[];
  providers: Provider[];
  isLoading: boolean;
  error: string;
}

const AssignServicePage: React.FC<Props> = ({ bookings, setBookings, customers, services, providers, isLoading, error }) => {
  const [active, setActive] = useState<Booking | null>(null);
  const [chosenProvider, setChosenProvider] = useState<string>('');
  const [availableProviders, setAvailableProviders] = useState<Provider[]>(providers);

  useEffect(() => {
    let isMounted = true;

    const loadProviders = async () => {
      try {
        const response = await getAllServicesProviders();
        if (isMounted) setAvailableProviders(response);
      } catch (providerError) {
        console.error('Failed to load providers:', providerError);
      }
    };

    void loadProviders();
    return () => {
      isMounted = false;
    };
  }, []);

  const customerName = (booking: Booking) => booking.customerName ?? customers.find((c) => c.id === booking.customerId)?.name ?? 'Unknown';
  const serviceName = (booking: Booking) => booking.serviceName ?? services.find((s) => s.id === booking.serviceId)?.name ?? 'Unknown service';

  const unassigned = bookings.filter((b) => !b.providerId && b.status !== 'cancelled' && b.status !== 'completed');
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed');

  const eligibleProviders = (booking: Booking) => {
    return availableProviders.filter((provider) => provider.status !== 'inactive' && provider.approvalStatus !== 'rejected');
  };

  const openAssign = (b: Booking) => {
    setActive(b);
    setChosenProvider('');
  };

  const confirmAssign = async () => {
    if (!active || !chosenProvider) return;

    try {
      await bookingApi.assignProvider(active.id, chosenProvider);
      setBookings((prev) =>
        prev.map((b) => (b.id === active.id ? {
          ...b,
          providerId: chosenProvider,
          status: 'assigned',
          providerName: availableProviders.find((provider) => provider.id === chosenProvider)?.name,
        } : b))
      );
      setActive(null);
    } catch (error) {
      console.error('Failed to assign provider:', error);
    }
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
            {isLoading && (
              <tr><td colSpan={6} className="empty-row">Loading bookings...</td></tr>
            )}
            {!isLoading && error && (
              <tr><td colSpan={6} className="empty-row">{error}</td></tr>
            )}
            {!isLoading && !error && activeBookings.map((b) => {
              return (
                <tr key={b.id}>
                  <td className="mono">{b.bookingCode}</td>
                  <td>{customerName(b)}</td>
                  <td>{serviceName(b)}</td>
                  <td>{b.scheduledDate} · {b.scheduledTime}</td>
                  <td><BookingStatusBadge status={b.status} /></td>
                  <td>
                    {b.providerId ? (
                      <span className="muted">Assigned</span>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => openAssign(b)}>Assign provider</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!isLoading && !error && activeBookings.length === 0 && (
              <tr><td colSpan={6} className="empty-row">No active bookings available.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <Modal title={`Assign provider · ${active.bookingCode}`} onClose={() => setActive(null)} width={520}>
          <p className="muted" style={{ marginBottom: 12 }}>
            Service: <strong>{serviceName(active)}</strong> on {active.scheduledDate} at {active.scheduledTime}
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
