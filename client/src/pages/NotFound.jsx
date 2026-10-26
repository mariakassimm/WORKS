import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section flex flex-col items-center py-32 text-center">
      <h1 className="font-display text-6xl font-semibold text-crimson">404</h1>
      <h2 className="mt-4 font-display text-2xl text-alloy">Page not found</h2>
      <p className="mt-2 text-sm text-ash">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </section>
  );
}
