import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import WhatsAppButton from "../components/WhatsAppButton";
import InquiryModal from "../components/InquiryModal";
import { SITE, telHref } from "../config/site";
import { submitReview } from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", rating: 5, message: "" });
  const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await submitReview(form);
      setStatus("sent");
      setForm({ name: "", rating: 5, message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <SEO title="Contact" />
      <section className="section py-20">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl font-semibold text-alloy sm:text-5xl"
        >
          Contact WORKS
        </motion.h1>
        <p className="mt-2 max-w-lg text-sm text-ash">Reach out about a part, or anything else — we reply directly by email.</p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-sm tracking-wide text-ash">Address</h2>
              <p className="mt-1 text-alloy">{SITE.address}</p>
            </div>
            <div>
              <h2 className="font-display text-sm tracking-wide text-ash">Phone</h2>
              <a href={telHref(SITE.phone)} className="mt-1 block text-alloy transition-colors hover:text-crimson">{SITE.phone}</a>
            </div>
            <div>
              <h2 className="font-display text-sm tracking-wide text-ash">Email</h2>
              <a href={`mailto:${SITE.email}`} className="mt-1 block text-alloy transition-colors hover:text-crimson">{SITE.email}</a>
            </div>
            <div>
              <h2 className="font-display text-sm tracking-wide text-ash">Business Hours</h2>
              <p className="mt-1 text-alloy">{SITE.hours}</p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="button" onClick={() => setInquiryOpen(true)} className="btn-primary">Send an Email</button>
              <WhatsAppButton />
            </div>

            <div className="panel flex flex-col items-start gap-4 p-6 sm:p-8">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-crimson" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="9.5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h2 className="font-display text-sm tracking-wide text-alloy">Find us</h2>
                <p className="mt-1 text-sm leading-relaxed text-ash">{SITE.address}</p>
              </div>
              {SITE.hasRealAddress ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Get Directions
                </a>
              ) : (
                <p className="text-xs text-ash">Demonstration address — directions are not available.</p>
              )}
            </div>
          </div>

          <div className="panel p-6 sm:p-8">
            <h2 className="font-display text-lg text-alloy">Leave a review</h2>
            <p className="mt-1 text-sm text-ash">Reviews are checked before they appear on the site.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="review-name" className="mb-1 block font-display text-xs tracking-wide text-ash">Name</label>
                <input id="review-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-sm border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none transition-colors focus:border-burgundy" />
              </div>
              <div>
                <label htmlFor="review-rating" className="mb-1 block font-display text-xs tracking-wide text-ash">Rating</label>
                <select id="review-rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full rounded-sm border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none transition-colors focus:border-burgundy">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="review-message" className="mb-1 block font-display text-xs tracking-wide text-ash">Message</label>
                <textarea id="review-message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-sm border border-steel bg-onyx px-3 py-2 text-sm text-alloy outline-none transition-colors focus:border-burgundy" />
              </div>
              <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Submit Review"}
              </button>
              {status === "sent" && <p className="text-sm text-crimson">Thanks — your review has been submitted for approval.</p>}
              {status === "error" && <p className="text-sm text-rust">Something went wrong. Please try again.</p>}
            </form>
          </div>
        </div>
      </section>
      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </>
  );
}
