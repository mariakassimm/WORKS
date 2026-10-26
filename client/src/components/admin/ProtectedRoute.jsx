import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { admin, checkSession } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    checkSession().finally(() => {
      if (active) setChecked(true);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-onyx text-ash">
        Loading…
      </div>
    );
  }

  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
