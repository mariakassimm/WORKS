import { useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategoryUsage,
} from "../../services/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [usage, setUsage] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([fetchCategories(), fetchCategoryUsage()])
      .then(([catData, usageData]) => {
        setCategories(catData.categories);
        setUsage(usageData.usage || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError("");
    const name = newName.trim();
    if (!name) {
      setAddError("Category name is required.");
      return;
    }
    setAdding(true);
    try {
      await createCategory({ name });
      setNewName("");
      setToast("Category added.");
      load();
    } catch (err) {
      setAddError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditValue(category.name);
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditError("");
  };

  const saveEdit = async (id) => {
    setEditError("");
    const name = editValue.trim();
    if (!name) {
      setEditError("Category name is required.");
      return;
    }
    setSavingEdit(true);
    try {
      await updateCategory(id, { name });
      setToast("Category updated.");
      setEditingId(null);
      load();
    } catch (err) {
      setEditError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteCategory(id);
      setConfirmDeleteId(null);
      setToast("Category removed.");
      load();
    } catch (err) {
      setToast(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-alloy">Categories ({categories.length})</h1>
      </div>

      {toast && <div className="mt-4 border border-burgundy bg-burgundy/10 px-4 py-2 text-sm text-crimson">{toast}</div>}

      <div className="panel mt-6 p-6">
        <h2 className="font-display text-sm tracking-wide text-ash">Add a category</h2>
        <form onSubmit={handleAdd} className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label htmlFor="new-category-name" className="sr-only">Category name</label>
            <input
              id="new-category-name"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); if (addError) setAddError(""); }}
              placeholder="e.g. Engine Parts"
              maxLength={60}
              className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy"
            />
            {addError && <p className="mt-1 text-xs text-rust">{addError}</p>}
          </div>
          <button type="submit" disabled={adding} className="btn-primary shrink-0 disabled:opacity-60">
            {adding ? "Adding…" : "+ Add Category"}
          </button>
        </form>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ash">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="mt-8 text-sm text-ash">No categories yet. Add one above to get started.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-steel text-ash">
                <th className="py-3 pr-4 font-display font-normal">Name</th>
                <th className="py-3 pr-4 font-display font-normal">Parts using it</th>
                <th className="py-3 pr-4 font-display font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const count = usage[c.name] || 0;
                const isEditing = editingId === c._id;
                return (
                  <tr key={c._id} className="border-b border-steel/50 align-top">
                    <td className="py-3 pr-4">
                      {isEditing ? (
                        <div>
                          <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => { setEditValue(e.target.value); if (editError) setEditError(""); }}
                            maxLength={60}
                            className="w-full border border-steel bg-onyx px-2 py-1.5 text-sm text-alloy outline-none focus:border-burgundy"
                          />
                          {editError && <p className="mt-1 text-xs text-rust">{editError}</p>}
                        </div>
                      ) : (
                        <span className="text-alloy">{c.name}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-ash">{count}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-3">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(c._id)} disabled={savingEdit} className="font-display text-xs text-crimson disabled:opacity-60">
                              {savingEdit ? "Saving…" : "Save"}
                            </button>
                            <button onClick={cancelEdit} className="font-display text-xs text-ash">Cancel</button>
                          </>
                        ) : confirmDeleteId === c._id ? (
                          <>
                            <span className="text-xs text-ash">
                              {count > 0 ? `${count} part${count > 1 ? "s" : ""} use this — delete anyway?` : "Delete this category?"}
                            </span>
                            <button onClick={() => handleDelete(c._id)} disabled={deletingId === c._id} className="font-display text-xs text-rust disabled:opacity-60">
                              {deletingId === c._id ? "Deleting…" : "Confirm"}
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} className="font-display text-xs text-ash">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(c)} className="font-display text-xs text-alloy hover:text-crimson">Edit</button>
                            <button onClick={() => setConfirmDeleteId(c._id)} className="font-display text-xs text-ash hover:text-rust">Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
