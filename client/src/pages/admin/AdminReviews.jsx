import { useEffect, useState } from "react";
import { fetchAllReviewsAdmin, updateReviewStatus, deleteReview } from "../../services/api";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAllReviewsAdmin().then((d) => setReviews(d.reviews)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await updateReviewStatus(id, status);
    load();
  };

  const remove = async (id) => {
    await deleteReview(id);
    load();
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-alloy">Reviews</h1>
      <p className="mt-1 text-sm text-ash">Approve reviews to show them on the homepage.</p>

      {loading ? (
        <p className="mt-8 text-sm text-ash">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-8 text-sm text-ash">No reviews yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-alloy">{r.name} <span className="text-crimson">{"★".repeat(r.rating)}</span></p>
                  <p className="mt-1 text-sm text-ash">{r.message}</p>
                </div>
                <span className={`shrink-0 border px-2 py-1 text-xs font-display ${
                  r.status === "approved" ? "border-burgundy text-crimson" : r.status === "hidden" ? "border-rust text-rust" : "border-steel text-ash"
                }`}>
                  {r.status}
                </span>
              </div>
              <div className="mt-4 flex gap-3">
                {r.status !== "approved" && (
                  <button onClick={() => setStatus(r._id, "approved")} className="text-xs font-display text-crimson hover:underline">Approve</button>
                )}
                {r.status !== "hidden" && (
                  <button onClick={() => setStatus(r._id, "hidden")} className="text-xs font-display text-ash hover:text-alloy">Hide</button>
                )}
                <button onClick={() => remove(r._id)} className="text-xs font-display text-ash hover:text-rust">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
