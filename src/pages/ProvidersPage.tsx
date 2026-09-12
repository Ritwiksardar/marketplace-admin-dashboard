import React, { useState } from 'react';
import type { Category, Provider } from '../types';
import { ApprovalBadge, ToggleSwitch } from '../components/Controls';
import Modal from '../components/Modal';

interface Props {
  providers: Provider[];
  setProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
  categories: Category[];
}

const ProvidersPage: React.FC<Props> = ({ providers, setProviders, categories }) => {
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<Provider | null>(null);

  const categoryNames = (ids: string[]) =>
    ids.map((id) => categories.find((c) => c.id === id)?.name ?? 'Unknown').join(', ');

  const filtered = providers.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p)));
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Providers</h1>
          <p className="page-sub">Everyone onboarded to deliver services, approved or not.</p>
        </div>
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="count-pill">{filtered.length} providers</span>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Categories</th>
              <th>Rating</th>
              <th>Jobs done</th>
              <th>Approval</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="row-with-image">
                    <img src={p.avatar} alt="" style={{ borderRadius: '50%' }} />
                    <div>
                      <div>{p.name}</div>
                      <div className="muted small">{p.phone}</div>
                    </div>
                  </div>
                </td>
                <td>{categoryNames(p.categoryIds)}</td>
                <td>{p.rating ? `★ ${p.rating}` : '—'}</td>
                <td>{p.totalBookings}</td>
                <td><ApprovalBadge status={p.approvalStatus} /></td>
                <td><ToggleSwitch status={p.status} onChange={() => toggleStatus(p.id)} /></td>
                <td><button className="btn btn-ghost" onClick={() => setActive(p)}>View</button></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="empty-row">No providers match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <Modal title={active.name} onClose={() => setActive(null)} width={480}>
          <div className="detail-grid">
            <div><span className="muted">Email</span><p>{active.email}</p></div>
            <div><span className="muted">Phone</span><p>{active.phone}</p></div>
            <div><span className="muted">Categories</span><p>{categoryNames(active.categoryIds)}</p></div>
            <div><span className="muted">Rating</span><p>{active.rating ? `★ ${active.rating}` : 'No ratings yet'}</p></div>
            <div><span className="muted">Jobs completed</span><p>{active.totalBookings}</p></div>
            <div><span className="muted">Joined</span><p>{active.joinedAt}</p></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProvidersPage;
