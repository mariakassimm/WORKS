import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../../components/admin/ImageUploader";
import { fetchAllProductsAdmin, createProduct, updateProduct, fetchCategories, createCategory } from "../../services/api";

const CONDITIONS = ["used", "refurbished", "new"];
const AVAILABILITY = ["in_stock", "reserved", "sold"];

const emptyForm = {
  name: "", price: "", category: "", condition: "used", availability: "in_stock",
  vehicleMake: "", vehicleModel: "", compatibleYears: "", shortDescription: "", description: "",
  featured: false, images: [], specifications: [],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories().then((d) => setCategories(d.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    fetchAllProductsAdmin().then((d) => {
      const product = d.products.find((p) => p._id === id);
      if (product) {
        setForm({
          ...emptyForm,
          ...product,
          price: product.price ?? "",
          specifications: product.specifications || [],
        });
      }
    });
  }, [id, isEdit]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addSpec = () => update("specifications", [...form.specifications, { label: "", value: "" }]);
  const updateSpec = (idx, key, value) => {
    const specs = [...form.specifications];
    specs[idx] = { ...specs[idx], [key]: value };
    update("specifications", specs);
  };
  const removeSpec = (idx) => update("specifications", form.specifications.filter((_, i) => i !== idx));

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const data = await createCategory({ name: newCategory.trim() });
    setCategories((c) => [...c, data.category]);
    update("category", data.category.name);
    setNewCategory("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      // Explicit allow-list — the edit form's state is pre-populated from the
      // fetched product (see the effect above), which includes DB-managed
      // fields like _id, slug, createdAt, updatedAt. Sending those back on
      // every save is fragile and unnecessary, so only the actual editable
      // fields are included here.
      const payload = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        condition: form.condition,
        availability: form.availability,
        vehicleMake: form.vehicleMake,
        vehicleModel: form.vehicleModel,
        compatibleYears: form.compatibleYears,
        shortDescription: form.shortDescription,
        description: form.description,
        featured: form.featured,
        images: form.images,
        specifications: form.specifications,
      };
      if (isEdit) {
        await updateProduct(id, payload);
        setSuccess("Part updated successfully.");
      } else {
        await createProduct(payload);
        setSuccess("Part added successfully.");
        setForm(emptyForm);
      }
      setTimeout(() => navigate("/admin/products"), 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl text-alloy">{isEdit ? "Edit Part" : "Add New Part"}</h1>
      <p className="mt-1 text-sm text-ash">Fill in the details below, then click Save Part.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="panel p-6">
          <h2 className="font-display text-sm tracking-wide text-ash">Basic Info</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="product-name" className="mb-1 block text-xs text-ash">Part Name</label>
              <input id="product-name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Front Bumper Assembly" className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
            <div>
              <label htmlFor="product-price" className="mb-1 block text-xs text-ash">Price (Rs)</label>
              <input id="product-price" required type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
            <div>
              <label htmlFor="product-category" className="mb-1 block text-xs text-ash">Category</label>
              <div className="flex gap-2">
                <select id="product-category" required value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy">
                  <option value="">Select…</option>
                  {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="mt-2 flex gap-2">
                <label htmlFor="new-category" className="sr-only">New category name</label>
                <input id="new-category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category" className="flex-1 border border-steel bg-onyx px-2 py-1.5 text-xs text-alloy outline-none focus:border-burgundy" />
                <button type="button" onClick={handleAddCategory} className="border border-steel px-3 text-xs text-ash hover:text-crimson">Add</button>
              </div>
            </div>
            <div>
              <label htmlFor="product-condition" className="mb-1 block text-xs text-ash">Condition</label>
              <select id="product-condition" value={form.condition} onChange={(e) => update("condition", e.target.value)} className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy">
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="product-availability" className="mb-1 block text-xs text-ash">Availability</label>
              <select id="product-availability" value={form.availability} onChange={(e) => update("availability", e.target.value)} className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy">
                {AVAILABILITY.map((a) => <option key={a} value={a}>{a.replace("_", " ")}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input id="featured" type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="h-4 w-4 accent-burgundy" />
              <label htmlFor="featured" className="text-sm text-alloy">Featured on homepage</label>
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-sm tracking-wide text-ash">Vehicle Compatibility</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="vehicle-make" className="mb-1 block text-xs text-ash">Make</label>
              <input id="vehicle-make" value={form.vehicleMake} onChange={(e) => update("vehicleMake", e.target.value)} placeholder="Toyota" className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
            <div>
              <label htmlFor="vehicle-model" className="mb-1 block text-xs text-ash">Model</label>
              <input id="vehicle-model" value={form.vehicleModel} onChange={(e) => update("vehicleModel", e.target.value)} placeholder="Corolla" className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
            <div>
              <label htmlFor="vehicle-years" className="mb-1 block text-xs text-ash">Years</label>
              <input id="vehicle-years" value={form.compatibleYears} onChange={(e) => update("compatibleYears", e.target.value)} placeholder="2014 - 2019" className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-sm tracking-wide text-ash">Description</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="short-description" className="mb-1 block text-xs text-ash">Short summary (shown on cards)</label>
              <input id="short-description" maxLength={160} value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
            <div>
              <label htmlFor="full-description" className="mb-1 block text-xs text-ash">Full description</label>
              <textarea id="full-description" required rows={5} value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm tracking-wide text-ash">Specifications (optional)</h2>
            <button type="button" onClick={addSpec} className="text-xs text-crimson hover:underline">+ Add row</button>
          </div>
          <div className="mt-4 space-y-2">
            {form.specifications.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <input aria-label={`Specification ${idx + 1} label`} value={s.label} onChange={(e) => updateSpec(idx, "label", e.target.value)} placeholder="Label" className="w-1/2 border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
                <input aria-label={`Specification ${idx + 1} value`} value={s.value} onChange={(e) => updateSpec(idx, "value", e.target.value)} placeholder="Value" className="w-1/2 border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
                <button type="button" onClick={() => removeSpec(idx)} aria-label={`Remove specification ${idx + 1}`} className="px-2 text-ash hover:text-rust">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-sm tracking-wide text-ash">Photos</h2>
          <div className="mt-4">
            <ImageUploader images={form.images} onChange={(images) => update("images", images)} />
          </div>
        </div>

        {error && <p className="text-sm text-rust">{error}</p>}
        {success && <p className="text-sm text-crimson">{success}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/admin/products")} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving…" : "Save Part"}
          </button>
        </div>
      </form>
    </div>
  );
}
