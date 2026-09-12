import React from 'react';
import type { ActiveStatus, BookingStatus, ProviderApprovalStatus, DocumentStatus } from '../types';

export const ToggleSwitch: React.FC<{
  status: ActiveStatus;
  onChange: () => void;
}> = ({ status, onChange }) => (
  <button
    className={`toggle ${status === 'active' ? 'toggle-on' : 'toggle-off'}`}
    onClick={onChange}
    title={status === 'active' ? 'Set inactive' : 'Set active'}
  >
    <span className="toggle-knob" />
  </button>
);

const bookingLabels: Record<BookingStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const BookingStatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => (
  <span className={`badge badge-${status}`}>{bookingLabels[status]}</span>
);

const approvalLabels: Record<ProviderApprovalStatus, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const ApprovalBadge: React.FC<{ status: ProviderApprovalStatus }> = ({ status }) => (
  <span className={`badge badge-approval-${status}`}>{approvalLabels[status]}</span>
);

const docLabels: Record<DocumentStatus, string> = {
  pending: 'Pending',
  verified: 'Verified',
  rejected: 'Rejected',
};

export const DocBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => (
  <span className={`doc-badge doc-badge-${status}`}>{docLabels[status]}</span>
);

export const ConfirmDialog: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay" onMouseDown={onCancel}>
    <div className="confirm-card" onMouseDown={(e) => e.stopPropagation()}>
      <p>{message}</p>
      <div className="confirm-actions">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);
