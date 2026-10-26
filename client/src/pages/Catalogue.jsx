import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import { fetchProducts, fetchCategories } from "../services/api";

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then((d) => setCategories(d.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = activeCategory ? { category: activeCategory } : {};
    fetchProducts(params)
      .then((d) => setProducts(d.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const selectCategory = (name) => {
    if (!name) setSearchParams({});
    else setSearchParams({ category: name });
  };

  return (
    <>
      <SEO title="Parts Catalogue" />
      <section className="section py-16">
        <h1 className="font-display text-4xl font-semibold text-alloy sm:text-5xl">Parts Catalogue</h1>
        <p className="mt-2 max-w-lg text-sm text-ash">Browse current stock. Tap a part to see full details and contact us.</p>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-steel pb-6">
          <button onClick={() => selectCategory("")} className={`rounded-sm border px-4 py-2 font-display text-sm transition-all duration-300 ease-premium ${!activeCategory ? "border-burgundy text-crimson" : "border-steel text-ash hover:text-alloy"}`}>
            All
          </button>
          {categories.map((c) => (
            <button key={c._id} onClick={() => selectCategory(c.name)} className={`rounded-sm border px-4 py-2 font-display text-sm transition-all duration-300 ease-premium ${activeCategory === c.name ? "border-burgundy text-crimson" : "border-steel text-ash hover:text-alloy"}`}>
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-sm border border-steel bg-graphite" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="mt-16 text-sm text-ash">No parts available in this category yet.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </>
  );
}
