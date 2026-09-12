import React, { useState } from 'react';
import type { SubCategory, Service } from '../types';
import Modal from '../components/Modal';
import { ToggleSwitch, ConfirmDialog } from '../components/Controls';

interface Props {
  subCategories: SubCategory[];
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

const emptyForm = { name: '', image: '', subCategoryId: '', price: '', duration: '', description: '' };

const ServicesPage: React.FC<Props> = ({ subCategories, services, setServices }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const subName = (id: string) => subCategories.find((s) => s.id === id)?.name ?? 'Unknown';

  const filtered = services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, subCategoryId: subCategories[0]?.id ?? '' });
    setModalOpen(true);
  };

  const openEdit = (svc: Service) => {
    setEditing(svc);
    setForm({
      name: svc.name,
      image: svc.image,
      subCategoryId: svc.subCategoryId,
      price: String(svc.price),
      duration: svc.duration,
      description: svc.description,
    });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.subCategoryId || !form.price) return;
    if (editing) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? {
                ...s,
                name: form.name,
                image: form.image || s.image,
                subCategoryId: form.subCategoryId,
                price: Number(form.price),
                duration: form.duration,
                description: form.description,
              }
            : s
        )
      );
    } else {
      const newSvc: Service = {
        id: `srv-${Date.now()}`,
        subCategoryId: form.subCategoryId,
        name: form.name,
        image: form.image || `https://picsum.photos/seed/${Date.now()}/200/200`,
        price: Number(form.price),
        duration: form.duration || '1 hr',
        description: form.description,
        status: 'active',
      };
      setServices((prev) => [newSvc, ...prev]);
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    );
  };

  const remove = () => {
    setServices((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Services</h1>
          <p className="page-sub">Individual bookable services shown to customers, priced and timed.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add service</button>
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="count-pill">{filtered.length} services</span>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Sub-category</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((svc) => (
              <tr key={svc.id}>
                <td>
                  <div className="row-with-image">
                    <img src={svc.image} alt="" />
                    <span>{svc.name}</span>
                  </div>
                </td>
                <td>{subName(svc.subCategoryId)}</td>
                <td>৳{svc.price}</td>
                <td>{svc.duration}</td>
                <td><ToggleSwitch status={svc.status} onChange={() => toggleStatus(svc.id)} /></td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-ghost" onClick={() => openEdit(svc)}>Edit</button>
                    <button className="btn btn-ghost btn-danger-text" onClick={() => setDeleteId(svc.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="empty-row">No services match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit service' : 'Add service'} onClose={() => setModalOpen(false)} width={560}>
          <label className="field">
            <span>Service name</span>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 2 BHK Deep Cleaning" />
          </label>
          <label className="field">
            <span>Sub-category</span>
            <select className="input select" value={form.subCategoryId} onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}>
              {subCategories.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
            </select>
          </label>
          <div className="field-row">
            <label className="field">
              <span>Price (৳)</span>
              <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="999" />
            </label>
            <label className="field">
              <span>Duration</span>
              <input className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 1.5 hrs" />
            </label>
          </div>
          <label className="field">
            <span>Image URL</span>
            <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea className="input textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's included in this service" />
          </label>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>{editing ? 'Save changes' : 'Add service'}</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog message="Delete this service? It will no longer be bookable by customers." onConfirm={remove} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
};

export default ServicesPage;
