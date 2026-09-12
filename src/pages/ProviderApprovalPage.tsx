import React, { useState } from 'react';
import type { Provider, DocumentStatus } from '../types';
import Modal from '../components/Modal';
import { ApprovalBadge, DocBadge } from '../components/Controls';

interface Props {
  providers: Provider[];
  setProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
}

const ProviderApprovalPage: React.FC<Props> = ({ providers, setProviders }) => {
  const [active, setActive] = useState<Provider | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const list = filter === 'pending' ? providers.filter((p) => p.approvalStatus === 'pending') : providers;

  const setDocStatus = (providerId: string, docType: string, status: DocumentStatus) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, documents: p.documents.map((d) => (d.type === docType ? { ...d, status } : d)) }
          : p
      )
    );
    setActive((prev) =>
      prev && prev.id === providerId
        ? { ...prev, documents: prev.documents.map((d) => (d.type === docType ? { ...d, status } : d)) }
        : prev
    );
  };

  const finalizeApproval = (providerId: string, approve: boolean) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, approvalStatus: approve ? 'approved' : 'rejected', status: approve ? 'active' : 'inactive' }
          : p
      )
    );
    setActive(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Provider approval</h1>
          <p className="page-sub">Verify submitted documents before letting a provider go live on the platform.</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="segmented">
          <button className={filter === 'pending' ? 'segmented-active' : ''} onClick={() => setFilter('pending')}>Pending review</button>
          <button className={filter === 'all' ? 'segmented-active' : ''} onClick={() => setFilter('all')}>All providers</button>
        </div>
        <span className="count-pill">{list.length} providers</span>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Category</th>
              <th>Documents</th>
              <th>Applied</th>
              <th>Approval</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="row-with-image">
                    <img src={p.avatar} alt="" style={{ borderRadius: '50%' }} />
                    <div>
                      <div>{p.name}</div>
                      <div className="muted small">{p.email}</div>
                    </div>
                  </div>
                </td>
                <td>{p.categoryIds.length} categor{p.categoryIds.length === 1 ? 'y' : 'ies'}</td>
                <td>{p.documents.filter((d) => d.status === 'verified').length}/{p.documents.length} verified</td>
                <td>{p.joinedAt}</td>
                <td><ApprovalBadge status={p.approvalStatus} /></td>
                <td><button className="btn btn-ghost" onClick={() => setActive(p)}>Review</button></td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} className="empty-row">Nothing waiting for review right now.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <Modal title={`Review · ${active.name}`} onClose={() => setActive(null)} width={560}>
          <div className="detail-grid" style={{ marginBottom: 16 }}>
            <div><span className="muted">Phone</span><p>{active.phone}</p></div>
            <div><span className="muted">Email</span><p>{active.email}</p></div>
            <div><span className="muted">Applied on</span><p>{active.joinedAt}</p></div>
            <div><span className="muted">Current status</span><p><ApprovalBadge status={active.approvalStatus} /></p></div>
          </div>

          <h4 style={{ margin: '4px 0 8px' }}>Submitted documents</h4>
          <div className="doc-list">
            {active.documents.map((d) => (
              <div className="doc-row" key={d.type}>
                <div>
                  <div>{d.type}</div>
                  <a href={d.fileUrl} className="doc-link" onClick={(e) => e.preventDefault()}>View document</a>
                </div>
                <div className="doc-row-right">
                  <DocBadge status={d.status} />
                  <div className="doc-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setDocStatus(active.id, d.type, 'verified')}>Verify</button>
                    <button className="btn btn-ghost btn-danger-text btn-sm" onClick={() => setDocStatus(active.id, d.type, 'rejected')}>Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {active.approvalStatus === 'pending' && (
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={() => finalizeApproval(active.id, false)}>Reject provider</button>
              <button className="btn btn-primary" onClick={() => finalizeApproval(active.id, true)}>Approve provider</button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ProviderApprovalPage;
