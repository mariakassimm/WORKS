import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Parts" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/reviews", label: "Reviews" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-onyx">
      <header className="border-b border-steel">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-6">
            <span className="hidden text-sm text-ash sm:inline">{admin?.email}</span>
            <button onClick={handleLogout} className="btn-secondary">Log Out</button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 px-6 pb-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `border px-4 py-2 font-display text-sm transition-colors ${isActive ? "border-burgundy text-crimson" : "border-steel text-ash hover:text-alloy"}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
