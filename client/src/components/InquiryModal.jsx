import { useEffect, useId, useRef, useState } from "react";
import Modal from "./Modal";
import { submitInquiry } from "../services/api";

// Mirrors server/validators/inquiryValidator.js — the backend is the source
// of truth; this just gives the customer instant feedback before submitting.
const EMAIL_RE = /^[^\s@,;<>()"']+@[^\s@,;<>()"']+\.[^\s@,;<>()"']+$/;
const PHONE_RE = /^[+]?[0-9\s().-]{7,20}$/;
const LIMITS = { name: 100, subject: 150, message: 1000 };

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "", website: "" };

const inputClass =
  "w-full rounded-sm border bg-onyx px-3 py-2 text-sm text-alloy outline-none transition-colors focus:border-burgundy";
const labelClass = "mb-1 block font-display text-xs tracking-wide text-ash";

/**
 * Inquiry form in a modal. Two modes:
 *  - Part inquiry (`partName` provided): used on product pages. Phone required.
 *  - General inquiry (no `partName`): used on Home/Contact. Subject required,
 *    phone optional.
 */
export default function InquiryModal({ open, onClose, partName }) {
  const isPart = Boolean(partName);
  const uid = useId();
  const id = (field) => `${uid}-${field}`;

  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [serverError, setServerError] = useState("");
  // Synchronous guard: state updates are async, so a fast double-click could
  // otherwise fire two requests before `status` flips to "sending".
  const inFlight = useRef(false);
  // Pending "focus the first invalid field" frame, cancelled if the modal closes first.
  const focusFrame = useRef(0);

  // Reset to a clean form each time the modal is freshly opened. Done during
  // render (not in an effect) so the previous values never flash for a frame.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(emptyForm);
      setFieldErrors({});
      setStatus("idle");
      setServerError("");
    }
  }
  useEffect(() => {
    if (open) inFlight.current = false;
    return () => cancelAnimationFrame(focusFrame.current);
  }, [open]);

  const sending = status === "sending";
  // Don't allow dismissal mid-request: the user would never see the outcome.
  const handleClose = () => {
    if (!sending) onClose();
  };

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const errors = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name) errors.name = "Name is required.";
    else if (name.length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;

    if (!email) errors.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

    if (!phone) {
      if (isPart) errors.phone = "Phone number is required.";
    } else if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number.";

    if (!isPart) {
      if (!subject) errors.subject = "Subject is required.";
      else if (subject.length > LIMITS.subject) errors.subject = `Subject must be under ${LIMITS.subject} characters.`;
    }

    if (!message) errors.message = "Message is required.";
    else if (message.length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      // Move focus to the first invalid field so keyboard/screen-reader users land on it.
      const order = ["name", "email", "phone", "subject", "message"];
      const first = order.find((k) => errors[k]);
      focusFrame.current = requestAnimationFrame(() => document.getElementById(id(first))?.focus());
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inFlight.current) return;
    setServerError("");
    if (!validate()) return;

    inFlight.current = true;
    setStatus("sending");
    try {
      await submitInquiry({
        ...(isPart ? { partName } : {}),
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: form.website, // honeypot — always empty for real users
      });
      setStatus("success");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) setFieldErrors(data.errors);
      if (err?.response?.status === 429) {
        setServerError(data?.message || "Too many inquiries sent. Please try again later.");
      } else if (!err?.response) {
        setServerError("We couldn't reach the server. Please check your connection and try again.");
      } else {
        setServerError(data?.message || "Something went wrong while sending your inquiry. Please try again later.");
      }
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  };

  const fieldProps = (key) => ({
    id: id(key),
    value: form[key],
    onChange: (e) => update(key, e.target.value),
    disabled: sending,
    "aria-invalid": Boolean(fieldErrors[key]),
    "aria-describedby": fieldErrors[key] ? `${id(key)}-error` : undefined,
    className: `${inputClass} ${fieldErrors[key] ? "border-rust" : "border-steel"}`,
  });

  const fieldError = (key) =>
    fieldErrors[key] ? (
      <p id={`${id(key)}-error`} className="mt-1 text-xs text-rust">
        {fieldErrors[key]}
      </p>
    ) : null;

  return (
    <Modal open={open} onClose={handleClose} title={isPart ? "Inquire About This Part" : "Send Us an Email"}>
      {status === "success" ? (
        <div role="status">
          <p className="text-sm leading-relaxed text-alloy">
            Your inquiry has been sent successfully.
            <br />
            We will get back to you soon.
          </p>
          <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {isPart && (
            <div>
              <label htmlFor={id("part")} className={labelClass}>
                Part
              </label>
              <input
                id={id("part")}
                value={partName}
                readOnly
                tabIndex={-1}
                className="w-full cursor-not-allowed rounded-sm border border-steel bg-onyx/60 px-3 py-2 text-sm text-ash outline-none"
              />
            </div>
          )}

          <div>
            <label htmlFor={id("name")} className={labelClass}>
              Full name
            </label>
            <input {...fieldProps("name")} autoComplete="name" maxLength={LIMITS.name + 20} />
            {fieldError("name")}
          </div>

          <div>
            <label htmlFor={id("email")} className={labelClass}>
              Email address
            </label>
            <input {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" />
            {fieldError("email")}
          </div>

          <div>
            <label htmlFor={id("phone")} className={labelClass}>
              Phone{isPart ? "" : " (optional)"}
            </label>
            <input {...fieldProps("phone")} type="tel" autoComplete="tel" placeholder="+1 202 555 0100" />
            {fieldError("phone")}
          </div>

          {!isPart && (
            <div>
              <label htmlFor={id("subject")} className={labelClass}>
                Subject
              </label>
              <input {...fieldProps("subject")} maxLength={LIMITS.subject + 20} />
              {fieldError("subject")}
            </div>
          )}

          <div>
            <label htmlFor={id("message")} className={labelClass}>
              Message
            </label>
            <textarea {...fieldProps("message")} rows={4} maxLength={LIMITS.message + 100} />
            <p className="mt-1 text-right text-xs text-ash" aria-hidden="true">
              {form.message.length}/{LIMITS.message}
            </p>
            {fieldError("message")}
          </div>

          {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
            <label htmlFor={id("website")}>Website</label>
            <input
              id={id("website")}
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>

          {status === "error" && serverError && (
            <p className="text-sm text-rust" role="alert">
              {serverError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={handleClose} disabled={sending} className="btn-secondary w-full disabled:opacity-60 sm:w-auto sm:flex-1">
              Cancel
            </button>
            <button type="submit" disabled={sending} aria-busy={sending} className="btn-primary w-full disabled:opacity-60 sm:flex-1">
              {sending ? "Sending…" : "Send Email"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
