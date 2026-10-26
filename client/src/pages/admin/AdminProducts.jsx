import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllProductsAdmin, deleteProduct, toggleVisibility } from "../../services/api";
import { formatPrice } from "../../config/site";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState("");

  const load = () => {
    setLoading(true);
    fetchAllProductsAdmin().then((d) => setProducts(d.products)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setConfirmDeleteId(null);
    setToast("Part removed successfully.");
    load();
  };

  const handleToggle = async (id) => {
    await toggleVisibility(id);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-alloy">Parts ({products.length})</h1>
        <Link to="/admin/products/new" className="btn-primary">+ Add New Part</Link>
      </div>

      {toast && <div className="mt-4 border border-burgundy bg-burgundy/10 px-4 py-2 text-sm text-crimson">{toast}</div>}

      {loading ? (
        <p className="mt-8 text-sm text-ash">Loading…</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-sm text-ash">No parts yet. Click "Add New Part" to get started.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-steel text-ash">
                <th className="py-3 pr-4 font-display font-normal">Photo</th>
                <th className="py-3 pr-4 font-display font-normal">Name</th>
                <th className="py-3 pr-4 font-display font-normal">Price</th>
                <th className="py-3 pr-4 font-display font-normal">Category</th>
                <th className="py-3 pr-4 font-display font-normal">Status</th>
                <th className="py-3 pr-4 font-display font-normal">Featured</th>
                <th className="py-3 pr-4 font-display font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const img = p.images?.find((i) => i.isMain) || p.images?.[0];
                return (
                  <tr key={p._id} className="border-b border-steel/50">
                    <td className="py-3 pr-4">
                      <div className="h-12 w-12 overflow-hidden border border-steel bg-graphite">
                        {img ? <img src={img.url} alt="" className="h-full w-full object-cover" /> : null}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-alloy">{p.name}</td>
                    <td className="py-3 pr-4 text-ash">{formatPrice(p.price)}</td>
                    <td className="py-3 pr-4 text-ash">{p.category}</td>
                    <td className="py-3 pr-4">
                      <button onClick={() => handleToggle(p._id)} className={`border px-2 py-1 text-xs font-display ${p.isPublished ? "border-burgundy text-crimson" : "border-steel text-ash"}`}>
                        {p.isPublished ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-ash">{p.featured ? "Yes" : "—"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-3">
                        <Link to={`/admin/products/${p._id}/edit`} className="font-display text-xs text-alloy hover:text-crimson">Edit</Link>
                        {confirmDeleteId === p._id ? (
                          <span className="flex gap-2">
                            <button onClick={() => handleDelete(p._id)} className="font-display text-xs text-rust">Confirm</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="font-display text-xs text-ash">Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(p._id)} className="font-display text-xs text-ash hover:text-rust">Delete</button>
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
