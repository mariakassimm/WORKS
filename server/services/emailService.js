const { Resend } = require("resend");

// Lazily created so the app can boot in development without a Resend API
// key configured yet — only sending an actual inquiry requires it.
let resendClient = null;

const getResendClient = () => {
  if (resendClient) return resendClient;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
};

// Minimal, dependency-free HTML escaping for user-controlled values before
// they're interpolated into the HTML email body.
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Collapse any whitespace/control characters (including CR/LF) so a value can
// never break out of an email header such as Subject.
const toHeaderValue = (value = "") => String(value).replace(/[\u0000-\u001F\u007F\s]+/g, " ").trim();

const buildInquiryEmail = ({ partName, subject: customerSubject, name, email, phone, message }) => {
  // A part inquiry is about a specific product; a general inquiry carries the
  // customer's own subject line.
  const topic = partName || customerSubject;
  const isPart = Boolean(partName);
  const safe = {
    topic: escapeHtml(topic),
    partName: escapeHtml(partName),
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone),
    message: escapeHtml(message).replace(/\n/g, "<br />"),
  };

  // Phone number stripped down to digits/+ for the tel: link
  const telHref = escapeHtml(String(phone).replace(/[^\d+]/g, ""));

  const subject = toHeaderValue(`New Inquiry: ${topic}`).slice(0, 200);

  const text = [
    "WORKS",
    isPart ? "New Part Inquiry" : "New General Inquiry",
    "",
    isPart ? `Part/Product: ${partName}` : `Subject: ${customerSubject}`,
    ...(isPart && customerSubject ? [`Subject: ${customerSubject}`] : []),
    "",
    "CUSTOMER DETAILS",
    `Name:  ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    "",
    "MESSAGE",
    message,
  ].join("\n");

  // Brand colors
  const burgundy = "#7A1E2C";
  const burgundyDark = "#5C1520";
  const cashmere = "#F3EBDD";
  const cashmereDeep = "#E6D8C3";
  const ink = "#2B2024";
  const muted = "#8A7B73";

  const labelStyle = `padding: 14px 0 2px 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: ${muted};`;
  const valueStyle = `padding: 0 0 14px 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; color: ${ink}; border-bottom: 1px solid ${cashmereDeep};`;
  const linkStyle = `color: ${burgundy}; text-decoration: none;`;

  const html = `
  <!-- Hidden preview text shown in inbox list -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    ${safe.name} is asking about ${safe.topic}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${cashmere}" style="background-color: ${cashmere};">
    <tr>
      <td align="center" style="padding: 32px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #FFFFFF; border-radius: 6px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="${burgundy}" style="background-color: ${burgundy}; padding: 34px 24px 30px 24px;">
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 30px; letter-spacing: 8px; color: ${cashmere}; font-weight: bold;">
                WORKS
              </div>
              <div style="width: 48px; height: 2px; background-color: ${cashmereDeep}; margin: 14px auto 12px auto; line-height: 2px; font-size: 2px;">&nbsp;</div>
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; letter-spacing: 3px; color: ${cashmereDeep}; text-transform: uppercase;">
                Customer Inquiry
              </div>
            </td>
          </tr>

          <!-- Part highlight -->
          <tr>
            <td style="padding: 32px 36px 8px 36px;">
              <div style="font-family: Arial, Helvetica, sans-serif; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: ${muted}; margin-bottom: 8px;">
                ${isPart ? "Inquiry About" : "Subject"}
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${cashmere}" style="background-color: ${cashmere}; border-left: 4px solid ${burgundy}; padding: 16px 20px; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: ${burgundyDark}; font-weight: bold;">
                    ${safe.topic}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer details -->
          <tr>
            <td style="padding: 20px 36px 0 36px;">
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 15px; letter-spacing: 2px; color: ${burgundy}; text-transform: uppercase; padding-bottom: 4px; border-bottom: 2px solid ${burgundy};">
                Customer Details
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="${labelStyle}">Name</td></tr>
                <tr><td style="${valueStyle}">${safe.name}</td></tr>

                <tr><td style="${labelStyle}">Email</td></tr>
                <tr><td style="${valueStyle}"><a href="mailto:${safe.email}" style="${linkStyle}">${safe.email}</a></td></tr>

                <tr><td style="${labelStyle}">Phone</td></tr>
                <tr><td style="${valueStyle}">${phone ? `<a href="tel:${telHref}" style="${linkStyle}">${safe.phone}</a>` : "Not provided"}</td></tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 28px 36px 8px 36px;">
              <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 15px; letter-spacing: 2px; color: ${burgundy}; text-transform: uppercase; padding-bottom: 12px;">
                Message
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="${cashmere}" style="background-color: ${cashmere}; border-radius: 4px; padding: 20px 22px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.7; color: ${ink};">
                    ${safe.message}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reply button -->
          <tr>
            <td align="center" style="padding: 28px 36px 36px 36px;">
              <a href="mailto:${safe.email}" style="display: inline-block; background-color: ${burgundy}; color: ${cashmere}; font-family: Arial, Helvetica, sans-serif; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 14px 34px; border-radius: 3px;">
                Reply to ${safe.name}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="${burgundyDark}" style="background-color: ${burgundyDark}; padding: 18px 24px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; letter-spacing: 1px; color: ${cashmereDeep};">
              Sent from the WORKS website inquiry form
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `;

  return { subject, text, html };
};

// Sends the inquiry to the configured business mailbox via Resend. Throws
// on failure — the caller (controller) decides how to respond to the
// client. The Resend SDK does NOT throw on API-level failures (invalid key,
// unverified sender domain, etc.) — it resolves with { data, error } — so
// that case is converted into a thrown Error here to keep the existing
// controller's try/catch behavior working unchanged.
const sendInquiryEmail = async ({ partName, subject: customerSubject, name, email, phone, message }) => {
  const businessEmail = process.env.BUSINESS_EMAIL;
  if (!businessEmail) {
    throw new Error("BUSINESS_EMAIL is not configured.");
  }
  const fromAddress = process.env.EMAIL_FROM;
  if (!fromAddress) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  const { subject, text, html } = buildInquiryEmail({ partName, subject: customerSubject, name, email, phone, message });
  const resend = getResendClient();

  const result = await resend.emails.send({
    from: `WORKS <${toHeaderValue(fromAddress)}>`,
    to: businessEmail,
    replyTo: email,
    subject,
    text,
    html,
  });

  if (result.error) {
    // Log full diagnostic detail server-side only (never sent to the client).
    console.error("[Resend send failed]", result.error);
    throw new Error(`Resend rejected the email: ${result.error.message || result.error.name}`);
  }
};

module.exports = { sendInquiryEmail };