import React, { useState } from 'react';
import type { Customer } from '../types';
import { ToggleSwitch } from '../components/Controls';

interface Props {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomersPage: React.FC<Props> = ({ customers, setCustomers }) => {
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c)));
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Customers</h1>
          <p className="page-sub">Everyone who has signed up on the customer app.</p>
        </div>
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="count-pill">{filtered.length} customers</span>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Bookings</th>
              <th>Total spent</th>
              <th>Joined</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="row-with-image">
                    <img src={c.avatar} alt="" style={{ borderRadius: '50%' }} />
                    <div>
                      <div>{c.name}</div>
                      <div className="muted small">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td>{c.phone}</td>
                <td>{c.totalBookings}</td>
                <td>৳{c.totalSpent.toLocaleString()}</td>
                <td>{c.joinedAt}</td>
                <td><ToggleSwitch status={c.status} onChange={() => toggleStatus(c.id)} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="empty-row">No customers match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;
