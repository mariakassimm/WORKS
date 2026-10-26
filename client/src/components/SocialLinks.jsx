import { SITE, SOCIALS } from "../config/site";

const ICONS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  youtube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  x: (
    <>
      <path d="M4 4h4.2l11.8 16h-4.2z" />
      <path d="M20 4l-6.6 7.6M4 20l6.6-7.6" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
};

function Icon({ id, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICONS[id]}
    </svg>
  );
}

const base = "flex h-11 w-11 items-center justify-center rounded-sm border transition-all duration-300 ease-premium";

/**
 * variant="about": every network is shown; unconfigured ones are disabled and
 *   labelled so nobody is sent to a fake or unrelated profile.
 * variant="footer": only configured networks are shown.
 */
export default function SocialLinks({ variant = "about" }) {
  const list = variant === "footer" ? SOCIALS.filter((s) => s.href) : SOCIALS;
  if (list.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-3" aria-label={`${SITE.name} social media`}>
      {list.map((s) => (
        <li key={s.id}>
          {s.href ? (
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE.name} on ${s.label} (opens in a new tab)`}
              className={`${base} border-steel text-ash hover:-translate-y-0.5 hover:border-burgundy hover:text-alloy hover:shadow-[0_10px_24px_-10px_rgba(122,30,44,0.7)]`}
            >
              <Icon id={s.id} />
            </a>
          ) : (
            <span
              role="img"
              aria-label={`${s.label} link not configured yet`}
              title={`${s.label} — demo placeholder, not linked yet`}
              className={`${base} cursor-not-allowed border-dashed border-ash/40 text-ash/60`}
            >
              <Icon id={s.id} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
