import React, { useState } from 'react';
import type { Banner, Category, Service, BannerLinkType } from '../types';
import Modal from '../components/Modal';
import { ToggleSwitch, ConfirmDialog } from '../components/Controls';

interface Props {
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  categories: Category[];
  services: Service[];
}

const emptyForm = { title: '', image: '', linkType: 'none' as BannerLinkType, linkId: '', order: '1' };

const BannersPage: React.FC<Props> = ({ banners, setBanners, categories, services }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const linkLabel = (b: Banner) => {
    if (b.linkType === 'category') return categories.find((c) => c.id === b.linkId)?.name ?? '—';
    if (b.linkType === 'service') return services.find((s) => s.id === b.linkId)?.name ?? '—';
    return 'No link';
  };

  const sorted = [...banners].sort((a, b) => a.order - b.order);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, order: String(banners.length + 1) });
    setModalOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({ title: b.title, image: b.image, linkType: b.linkType, linkId: b.linkId ?? '', order: String(b.order) });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.title.trim()) return;
    if (editing) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editing.id
            ? { ...b, title: form.title, image: form.image || b.image, linkType: form.linkType, linkId: form.linkId || undefined, order: Number(form.order) || b.order }
            : b
        )
      );
    } else {
      const newBanner: Banner = {
        id: `ban-${Date.now()}`,
        title: form.title,
        image: form.image || `https://picsum.photos/seed/${Date.now()}/400/160`,
        linkType: form.linkType,
        linkId: form.linkId || undefined,
        order: Number(form.order) || banners.length + 1,
        status: 'active',
      };
      setBanners((prev) => [...prev, newBanner]);
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b)));
  };

  const remove = () => {
    setBanners((prev) => prev.filter((b) => b.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Banners</h1>
          <p className="page-sub">Promotional banners shown on the customer app home screen, in display order.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add banner</button>
      </div>

      <div className="banner-grid">
        {sorted.map((b) => (
          <div className="banner-card" key={b.id}>
            <img src={b.image} alt="" />
            <div className="banner-card-body">
              <div className="banner-card-top">
                <span className="order-chip">#{b.order}</span>
                <ToggleSwitch status={b.status} onChange={() => toggleStatus(b.id)} />
              </div>
              <h4>{b.title}</h4>
              <p className="muted">Links to: {linkLabel(b)}</p>
              <div className="row-actions">
                <button className="btn btn-ghost" onClick={() => openEdit(b)}>Edit</button>
                <button className="btn btn-ghost btn-danger-text" onClick={() => setDeleteId(b.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="empty-row">No banners yet.</p>}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit banner' : 'Add banner'} onClose={() => setModalOpen(false)} width={520}>
          <label className="field">
            <span>Banner title</span>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Monsoon Cleaning Offer" />
          </label>
          <label className="field">
            <span>Image URL</span>
            <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Links to</span>
              <select className="input select" value={form.linkType} onChange={(e) => setForm({ ...form, linkType: e.target.value as BannerLinkType, linkId: '' })}>
                <option value="none">Nothing</option>
                <option value="category">A category</option>
                <option value="service">A service</option>
              </select>
            </label>
            <label className="field">
              <span>Display order</span>
              <input className="input" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </label>
          </div>
          {form.linkType !== 'none' && (
            <label className="field">
              <span>{form.linkType === 'category' ? 'Category' : 'Service'}</span>
              <select className="input select" value={form.linkId} onChange={(e) => setForm({ ...form, linkId: e.target.value })}>
                <option value="">Select...</option>
                {(form.linkType === 'category' ? categories : services).map((item) => (
                  <option value={item.id} key={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
          )}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>{editing ? 'Save changes' : 'Add banner'}</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog message="Delete this banner? It will be removed from the customer app immediately." onConfirm={remove} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
};

export default BannersPage;
