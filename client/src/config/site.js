// Single source of truth for brand name and public contact details.
//
// Every value below can be overridden at BUILD time with a VITE_* variable
// (see client/.env.example). The defaults are clearly fictional demonstration
// details — replace them through the environment before launch; do not edit
// them into components.
const env = import.meta.env;

export const SITE = {
  name: "WORKS",
  tagline: "Premium Used Automotive Parts",
  description:
    "WORKS supplies inspected, quality used engine, body and wheel parts for old and new vehicles. Browse the catalogue and contact us directly.",
  phone: env.VITE_BUSINESS_PHONE || "+1 (202) 555-0147",
  email: env.VITE_BUSINESS_EMAIL || "hello@example.com",
  address: env.VITE_BUSINESS_ADDRESS || "100 Example Avenue, Sample City, ZZ 00000",
  hours: env.VITE_BUSINESS_HOURS || "Mon – Sat, 9:00 AM – 6:00 PM",
  // WhatsApp is only offered when a real number is configured. A fictional
  // number would send visitors to a stranger's (or non-existent) account.
  whatsapp: (env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, ""),
  currency: env.VITE_CURRENCY_SYMBOL ?? "$",
  // True only when the owner has supplied their own address, so "Get
  // Directions" is never offered for the demonstration address.
  hasRealAddress: Boolean(env.VITE_BUSINESS_ADDRESS),
  hasRealContact: Boolean(env.VITE_BUSINESS_EMAIL && env.VITE_BUSINESS_PHONE && env.VITE_BUSINESS_ADDRESS),
};

export const telHref = (phone) => `tel:${String(phone).replace(/[^+\d]/g, "")}`;

// Social profiles. Leave a URL empty and the About page shows a clearly
// labelled, disabled placeholder while the footer omits it entirely.
// Only https:// URLs are accepted.
const safeUrl = (value) => (typeof value === "string" && /^https:\/\/[^\s]+$/i.test(value.trim()) ? value.trim() : "");

export const SOCIALS = [
  { id: "instagram", label: "Instagram", href: safeUrl(env.VITE_SOCIAL_INSTAGRAM) },
  { id: "facebook", label: "Facebook", href: safeUrl(env.VITE_SOCIAL_FACEBOOK) },
  { id: "youtube", label: "YouTube", href: safeUrl(env.VITE_SOCIAL_YOUTUBE) },
  { id: "x", label: "X", href: safeUrl(env.VITE_SOCIAL_X) },
  { id: "linkedin", label: "LinkedIn", href: safeUrl(env.VITE_SOCIAL_LINKEDIN) },
];

export const formatPrice = (value) => `${SITE.currency}${Number(value || 0).toLocaleString()}`;
