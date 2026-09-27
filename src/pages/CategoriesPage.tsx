import React, { useEffect, useState } from 'react';
import type { Category } from '../types';
import Modal from '../components/Modal';
import { ToggleSwitch, ConfirmDialog } from '../components/Controls';
import { catalogApi } from '../api/catalogApi';

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

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        const data = await catalogApi.getCategories();
        if (active) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to load categories from API:', error);
      }
    };

    if (!categories.length) {
      void loadCategories();
    }

    return () => {
      active = false;
    };
  }, [categories.length, setCategories]);

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

  const save = async () => {
    if (!form.name.trim()) return;

    try {
      if (editing) {
        const response = await catalogApi.updateCategory(editing.id, {
          name: form.name,
          description: 'Updated from admin panel',
          image: form.image || editing.image,
          isActive: editing.status === 'active',
        });

        const updatedCategory = response.data?.category ?? response.data ?? editing;
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? {
                  ...c,
                  name: updatedCategory?.name ?? form.name,
                  image: form.image || c.image,
                  status: updatedCategory?.isActive === false ? 'inactive' : 'active',
                }
              : c
          )
        );
      } else {
        const response = await catalogApi.createCategory({
          name: form.name,
          description: 'Created from admin panel',
          isActive: true,
          image: form.image || `https://picsum.photos/seed/${Date.now()}/200/200`,
        });

        const createdCategory = response.data?.category ?? response.data;
        const newCat: Category = {
          id: createdCategory?.id ?? `cat-${Date.now()}`,
          name: createdCategory?.name ?? form.name,
          image: form.image || `https://picsum.photos/seed/${Date.now()}/200/200`,
          status: createdCategory?.isActive === false ? 'inactive' : 'active',
          subCategoryCount: 0,
          createdAt: createdCategory?.createdAt ?? new Date().toISOString().slice(0, 10),
        };

        setCategories((prev) => [newCat, ...prev]);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }

    setModalOpen(false);
  };

  const toggleStatus = async (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    const nextStatus = category.status === 'active' ? 'inactive' : 'active';

    try {
      await catalogApi.updateCategory(id, { isActive: nextStatus === 'active' });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
      );
    } catch (error) {
      console.error('Failed to update category status:', error);
    }
  };

  const remove = async () => {
    if (!deleteId) return;

    try {
      await catalogApi.deleteCategory(deleteId);
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    } catch (error) {
      console.error('Failed to delete category:', error);
    }

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
