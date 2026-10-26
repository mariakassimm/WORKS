import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchStats } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then((d) => setStats(d.stats)).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Parts", value: stats?.total },
    { label: "Featured Parts", value: stats?.featured },
    { label: "In Stock", value: stats?.inStock },
    { label: "Categories", value: stats?.categoryCount },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-alloy">Dashboard</h1>
          <p className="mt-1 text-sm text-ash">A quick look at what's on the site right now.</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">+ Add New Part</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="panel p-6">
            <p className="font-display text-3xl font-semibold text-crimson">{c.value ?? "—"}</p>
            <p className="mt-1 text-sm text-ash">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 panel p-6">
        <h2 className="font-display text-lg text-alloy">Getting started</h2>
        <ul className="mt-4 space-y-2 text-sm text-ash">
          <li>1. Click <span className="text-alloy">Add New Part</span> above.</li>
          <li>2. Fill in the part's name, price, and description.</li>
          <li>3. Drag and drop photos into the uploader.</li>
          <li>4. Click <span className="text-alloy">Save Part</span> — it's live on the site immediately.</li>
        </ul>
      </div>
    </div>
  );
}
