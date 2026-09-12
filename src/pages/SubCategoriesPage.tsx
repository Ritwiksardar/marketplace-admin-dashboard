import React, { useState } from 'react';
import type { Category, SubCategory } from '../types';
import Modal from '../components/Modal';
import { ToggleSwitch, ConfirmDialog } from '../components/Controls';

interface Props {
  categories: Category[];
  subCategories: SubCategory[];
  setSubCategories: React.Dispatch<React.SetStateAction<SubCategory[]>>;
}

const emptyForm = { name: '', image: '', categoryId: '' };

const SubCategoriesPage: React.FC<Props> = ({ categories, subCategories, setSubCategories }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SubCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? 'Unknown';

  const filtered = subCategories.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === 'all' || s.categoryId === categoryFilter)
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id ?? '' });
    setModalOpen(true);
  };

  const openEdit = (sub: SubCategory) => {
    setEditing(sub);
    setForm({ name: sub.name, image: sub.image, categoryId: sub.categoryId });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.categoryId) return;
    if (editing) {
      setSubCategories((prev) =>
        prev.map((s) =>
          s.id === editing.id ? { ...s, name: form.name, image: form.image || s.image, categoryId: form.categoryId } : s
        )
      );
    } else {
      const newSub: SubCategory = {
        id: `sub-${Date.now()}`,
        categoryId: form.categoryId,
        name: form.name,
        image: form.image || `https://picsum.photos/seed/${Date.now()}/200/200`,
        status: 'active',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setSubCategories((prev) => [newSub, ...prev]);
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setSubCategories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    );
  };

  const remove = () => {
    setSubCategories((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Sub-categories</h1>
          <p className="page-sub">Group services under a parent category for browsing in the customer app.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add sub-category</button>
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search sub-categories..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
        </select>
        <span className="count-pill">{filtered.length} items</span>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Sub-category</th>
              <th>Parent category</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id}>
                <td>
                  <div className="row-with-image">
                    <img src={sub.image} alt="" />
                    <span>{sub.name}</span>
                  </div>
                </td>
                <td>{categoryName(sub.categoryId)}</td>
                <td>{sub.createdAt}</td>
                <td><ToggleSwitch status={sub.status} onChange={() => toggleStatus(sub.id)} /></td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-ghost" onClick={() => openEdit(sub)}>Edit</button>
                    <button className="btn btn-ghost btn-danger-text" onClick={() => setDeleteId(sub.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="empty-row">No sub-categories match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit sub-category' : 'Add sub-category'} onClose={() => setModalOpen(false)}>
          <label className="field">
            <span>Sub-category name</span>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Deep Cleaning" />
          </label>
          <label className="field">
            <span>Parent category</span>
            <select className="input select" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              {categories.map((c) => <option value={c.id} key={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Image URL</span>
            <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </label>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>{editing ? 'Save changes' : 'Add sub-category'}</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this sub-category? Services linked to it will remain but lose this grouping."
          onConfirm={remove}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default SubCategoriesPage;
