import { Link } from "react-router-dom";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import { SITE, SOCIALS, telHref } from "../config/site";

const EXPLORE = [
  { to: "/", label: "Home" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const linkClass = "inline-block py-1 transition-colors duration-200 hover:text-alloy focus-visible:text-alloy";

export default function Footer() {
  return (
    <footer className="border-t border-steel bg-charcoal">
      <div className="h-px bg-gradient-to-r from-transparent via-burgundy to-transparent" aria-hidden="true" />

      <div className="section grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1.2fr] lg:gap-16">
        <div>
          <Link to="/" aria-label={`${SITE.name} home`} className="inline-block">
            <Logo />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">
            Inspected used engine, body and wheel parts for dealers, mechanics and drivers of old and new vehicles.
          </p>
          {SOCIALS.some((s) => s.href) && (
            <div className="mt-6">
              <SocialLinks variant="footer" />
            </div>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-xs font-medium tracking-[0.25em] text-alloy">EXPLORE</h2>
          <ul className="mt-5 space-y-3 text-sm text-ash">
            {EXPLORE.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-xs font-medium tracking-[0.25em] text-alloy">CONTACT</h2>
          <address className="mt-5 space-y-3 text-sm not-italic text-ash">
            <p>
              <a href={`mailto:${SITE.email}`} className={linkClass}>
                {SITE.email}
              </a>
            </p>
            <p>
              <a href={telHref(SITE.phone)} className={linkClass}>
                {SITE.phone}
              </a>
            </p>
            <p className="max-w-xs leading-relaxed">{SITE.address}</p>
            <p>{SITE.hours}</p>
          </address>
        </div>
      </div>

      <div className="border-t border-steel">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-ash sm:flex-row">
          <span>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>
          {!SITE.hasRealContact && <span>Demonstration contact details</span>}
        </div>
      </div>
    </footer>
  );
}
