import { SITE } from "../config/site";

export default function WhatsAppButton({ productName, floating = false }) {
  // No number configured -> render nothing rather than link to a fictional account.
  if (!SITE.whatsapp) return null;

  const message = productName
    ? `Hello WORKS, I am interested in: ${productName}. Please share more details.`
    : "Hello WORKS, I'd like to ask about a part.";
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

  if (floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ask on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-onyx shadow-lg shadow-black/40 transition-transform duration-300 ease-premium hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.63 1.44 5.19L2 22l5.06-1.53a9.9 9.9 0 0 0 4.98 1.34h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2Zm5.79 14.05c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 1.99.9 2.13.07.15.12.32.02.51-.1.19-.15.3-.29.46-.15.16-.31.36-.44.48-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.29.15.46.13.63-.08.17-.2.72-.84.92-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
        </svg>
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full sm:w-auto">
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.63 1.44 5.19L2 22l5.06-1.53a9.9 9.9 0 0 0 4.98 1.34h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2Zm5.79 14.05c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 1.99.9 2.13.07.15.12.32.02.51-.1.19-.15.3-.29.46-.15.16-.31.36-.44.48-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.35 1.45.29.15.46.13.63-.08.17-.2.72-.84.92-1.13.19-.29.38-.24.63-.14.26.1 1.65.78 1.93.92.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
      </svg>
      Ask on WhatsApp
    </a>
  );
}
