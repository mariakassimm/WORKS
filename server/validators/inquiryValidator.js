const EMAIL_RE = /^[^\s@,;<>()"']+@[^\s@,;<>()"']+\.[^\s@,;<>()"']+$/;
// Permissive on purpose — accepts local and international formats
// (+92 300 1234567, (021) 1234567, 0300-1234567, etc.) without being
// overly restrictive about a specific country's numbering plan.
const PHONE_RE = /^[+]?[0-9\s().-]{7,20}$/;
// Any ASCII control character (includes CR/LF, which enable email header injection).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\u0000-\u001F\u007F]/;
// Same, but allowing line breaks and tabs (used for the free-text message only).
// eslint-disable-next-line no-control-regex
const MESSAGE_BAD_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

const LIMITS = {
  partName: 200,
  subject: 150,
  name: 100,
  email: 254,
  phone: 25,
  message: 1000,
};

// Source of truth for inquiry validation. The browser form mirrors these
// rules only to give instant feedback; nothing from the client is trusted.
//
// Two kinds of inquiry share this validator:
//   - Part inquiry:    `partName` present  -> phone required, subject optional
//   - General inquiry: `partName` absent   -> subject required, phone optional
const validateInquiry = (body = {}) => {
  const errors = {};
  const str = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : null);

  const raw = {
    partName: str(body.partName),
    subject: str(body.subject),
    name: str(body.name),
    email: str(body.email),
    phone: str(body.phone),
    message: str(body.message),
  };

  // Non-string input (objects/arrays/numbers) is malformed, not coercible.
  for (const [key, val] of Object.entries(raw)) {
    if (val === null) errors[key] = "Invalid value.";
  }

  const { partName = "", subject = "", name = "", email = "", phone = "", message = "" } = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, v ?? ""])
  );

  const isPartInquiry = partName.length > 0;

  // Single-line fields must not contain control characters (header injection).
  const singleLine = { partName, subject, name, email, phone };
  for (const [key, val] of Object.entries(singleLine)) {
    if (!errors[key] && CONTROL_CHARS_RE.test(val)) errors[key] = "Contains invalid characters.";
  }
  if (!errors.message && MESSAGE_BAD_CHARS_RE.test(message)) errors.message = "Contains invalid characters.";

  if (!errors.partName && partName.length > LIMITS.partName) errors.partName = "Part name is too long.";

  if (!errors.subject) {
    if (!isPartInquiry && !subject) errors.subject = "Subject is required.";
    else if (subject.length > LIMITS.subject) errors.subject = `Subject must be under ${LIMITS.subject} characters.`;
  }

  if (!errors.name) {
    if (!name) errors.name = "Name is required.";
    else if (name.length > LIMITS.name) errors.name = `Name must be under ${LIMITS.name} characters.`;
  }

  if (!errors.email) {
    if (!email) errors.email = "Email is required.";
    else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  }

  if (!errors.phone) {
    if (!phone) {
      if (isPartInquiry) errors.phone = "Phone number is required.";
    } else if (!PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number.";
  }

  if (!errors.message) {
    if (!message) errors.message = "Message is required.";
    else if (message.length > LIMITS.message) errors.message = `Message must be under ${LIMITS.message} characters.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    clean: { partName, subject, name, email, phone, message },
  };
};

module.exports = { validateInquiry, LIMITS };
