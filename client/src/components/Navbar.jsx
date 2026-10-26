import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { SITE } from "../config/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation (render-time reset, no effect needed)
  // and, below, on Escape.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ease-premium ${
        scrolled ? "border-steel/80 bg-onyx/75 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="section flex h-20 items-center justify-between">
        <Link to="/" aria-label={`${SITE.name} home`} className="rounded-sm"><Logo /></Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative font-display text-sm font-medium tracking-wide transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-burgundy after:transition-all after:duration-300 after:ease-premium ${
                  isActive ? "text-alloy after:w-full" : "text-ash after:w-0 hover:text-alloy hover:after:w-full"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center md:flex">
          <Link to="/contact" className="btn-primary">Contact Us</Link>
        </div>

        <button type="button" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-menu" className="flex h-11 w-11 items-center justify-center border border-steel md:hidden">
          <div className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 bg-alloy transition-transform duration-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-alloy transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-alloy transition-transform duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-steel bg-onyx md:hidden"
          >
            <div className="section flex flex-col gap-5 py-6">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `font-display text-lg font-medium ${isActive ? "text-crimson" : "text-alloy"}`}
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">Contact Us</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
