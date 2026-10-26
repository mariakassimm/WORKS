import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err?.response?.data?.message || "Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-onyx px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="panel p-8">
          <h1 className="font-display text-xl text-alloy">Admin Login</h1>
          <p className="mt-1 text-sm text-ash">Manage WORKS parts and content.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1 block font-display text-xs tracking-wide text-ash">Email</label>
              <input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1 block font-display text-xs tracking-wide text-ash">Password</label>
              <input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none focus:border-burgundy" />
            </div>
            {error && <p className="text-sm text-rust">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
