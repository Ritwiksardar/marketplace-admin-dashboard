import React, { useState } from 'react';
import type { Category } from '../types';
import Modal from '../components/Modal';
import { ToggleSwitch, ConfirmDialog } from '../components/Controls';

interface Props {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const emptyForm = { name: '', image: '' };

const CategoriesPage: React.FC<Props> = ({ categories, setCategories }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, image: cat.image });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, name: form.name, image: form.image || c.image } : c))
      );
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: form.name,
        image: form.image || `https://picsum.photos/seed/${Date.now()}/200/200`,
        status: 'active',
        subCategoryCount: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCategories((prev) => [newCat, ...prev]);
    }
    setModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c))
    );
  };

  const remove = () => {
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Categories</h1>
          <p className="page-sub">Top-level groupings that organize sub-categories and services.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add category</button>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="count-pill">{filtered.length} categories</span>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Sub-categories</th>
              <th>Created</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <div className="row-with-image">
                    <img src={cat.image} alt="" />
                    <span>{cat.name}</span>
                  </div>
                </td>
                <td>{cat.subCategoryCount}</td>
                <td>{cat.createdAt}</td>
                <td><ToggleSwitch status={cat.status} onChange={() => toggleStatus(cat.id)} /></td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-ghost" onClick={() => openEdit(cat)}>Edit</button>
                    <button className="btn btn-ghost btn-danger-text" onClick={() => setDeleteId(cat.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="empty-row">No categories match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit category' : 'Add category'} onClose={() => setModalOpen(false)}>
          <label className="field">
            <span>Category name</span>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Home Cleaning" />
          </label>
          <label className="field">
            <span>Image URL</span>
            <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          </label>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={save}>{editing ? 'Save changes' : 'Add category'}</button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="Delete this category? Its sub-categories and services will remain but lose this grouping."
          onConfirm={remove}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
