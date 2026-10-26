import { useId } from "react";

/**
 * WORKS brand mark: a wheel-inspired emblem (machined ring, bolt circle,
 * burgundy accent arc) with a W monogram built from two interlocking V
 * strokes. Pure SVG so it stays sharp at any size; gradient ids are unique per
 * instance so several logos can share a page. Mirrors /public/favicon.svg.
 */
export function LogoMark({ className = "h-10 w-10" }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 64 64" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-m`} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#B4B4B4" />
          <stop offset="1" stopColor="#6A6A6A" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C23A52" />
          <stop offset="1" stopColor="#7A1E2C" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="#0B0B0B" />
      <circle cx="32" cy="32" r="29" fill="none" stroke={`url(#${id}-m)`} strokeWidth="2.4" />
      <path d="M37.12 3.95 A29 29 0 0 1 60.4 27" fill="none" stroke={`url(#${id}-b)`} strokeWidth="3.8" />
      <circle cx="32" cy="32" r="23.5" fill="none" stroke="#8C8C8C" strokeWidth="1.2" strokeDasharray="1.6 4.68" />
      <path d="M15.5 21.5 L23.5 43.5 L32 27 L40.5 43.5 L48.5 21.5" fill="none" stroke="#F5F5F5" strokeWidth="4.6" strokeLinejoin="miter" strokeMiterlimit="10" />
      <path d="M23.5 43.5 L32 27 L40.5 43.5" fill="none" stroke={`url(#${id}-b)`} strokeWidth="4.6" strokeLinejoin="miter" strokeMiterlimit="10" />
    </svg>
  );
}

export default function Logo({ variant = "full", className = "" }) {
  if (variant === "mark") return <LogoMark className={className || "h-10 w-10"} />;

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-10 w-10" />
      <span className="flex flex-col leading-none">
        <span className="-mr-[0.22em] font-display text-[1.45rem] font-bold tracking-[0.22em] text-alloy">WORKS</span>
        <span className="mt-1.5 flex items-center gap-2">
          <span className="h-px w-5 bg-burgundy-light" />
          <span className="font-display text-[8.5px] font-medium tracking-[0.42em] text-ash">AUTOMOTIVE PARTS</span>
        </span>
      </span>
    </span>
  );
}
