// Run with: npm test   (Node's built-in test runner, no extra dependencies)
//
// These tests exercise the real Express app (validation, rate limiting, CORS,
// body limits, error handling) WITHOUT a database. Outbound calls to Resend are
// intercepted by replacing global fetch inside this test process only — no
// mock code exists in production source. This verifies request construction
// and error handling; it does NOT prove real email delivery.
const test = require("node:test");
const assert = require("node:assert/strict");

process.env.NODE_ENV = "test";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.RESEND_API_KEY = "re_test_key_not_real";
process.env.EMAIL_FROM = "inquiries@example.test";
process.env.BUSINESS_EMAIL = "owner@example.test";

const realFetch = global.fetch;
let resendCalls = [];
let resendResponder = () => ({ status: 200, body: { id: "email_123" } });

global.fetch = async (url, init) => {
  if (String(url).includes("api.resend.com")) {
    resendCalls.push({ url: String(url), init, body: JSON.parse(init.body) });
    const { status, body } = resendResponder();
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
  }
  return realFetch(url, init);
};

const app = require("../app");
let server;
let base;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());
test.beforeEach(() => {
  resendCalls = [];
  resendResponder = () => ({ status: 200, body: { id: "email_123" } });
});

// Each test uses a distinct X-Forwarded-For so rate-limit counters don't collide
// (the app sets trust proxy = 1).
let ipCounter = 10;
const post = (body, { ip, headers = {}, raw } = {}) =>
  realFetch(`${base}/api/inquiries`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip || `10.0.0.${ipCounter++}`, ...headers },
    body: raw ?? JSON.stringify(body),
  });

const general = {
  name: "Ali Khan",
  email: "ali@example.com",
  phone: "",
  subject: "Need a Corolla gearbox",
  message: "Do you have a 2016 gearbox in stock?",
};
const part = { partName: "Front Bumper", name: "Sara", email: "sara@example.com", phone: "+1 202 555 0100", message: "Price?" };

test("valid general inquiry -> 200 and exactly one Resend request with correct fields", async () => {
  const res = await post(general);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).success, true);
  assert.equal(resendCalls.length, 1);
  const sent = resendCalls[0].body;
  assert.equal(sent.to, "owner@example.test"); // recipient comes from env, never the request
  assert.equal(sent.from, "WORKS <inquiries@example.test>");
  assert.equal(sent.reply_to, "ali@example.com");
  assert.equal(sent.subject, "New Inquiry: Need a Corolla gearbox");
  assert.match(sent.text, /Phone: Not provided/);
  const h = resendCalls[0].init.headers;
  const auth = typeof h.get === "function" ? h.get("authorization") : h.Authorization ?? h.authorization;
  assert.equal(auth, "Bearer re_test_key_not_real");
});

test("valid part inquiry (phone required) -> 200", async () => {
  const res = await post(part);
  assert.equal(res.status, 200);
  assert.equal(resendCalls[0].body.subject, "New Inquiry: Front Bumper");
});

test("part inquiry without phone -> 400", async () => {
  const res = await post({ ...part, phone: "" });
  assert.equal(res.status, 400);
  assert.ok((await res.json()).errors.phone);
  assert.equal(resendCalls.length, 0);
});

test("missing / invalid fields -> 400 with per-field errors, no email sent", async () => {
  const res = await post({ name: "", email: "not-an-email", subject: "", message: "" });
  assert.equal(res.status, 400);
  const { errors } = await res.json();
  assert.ok(errors.name && errors.email && errors.subject && errors.message);
  assert.equal(resendCalls.length, 0);
});

test("over-length message and subject rejected", async () => {
  const res = await post({ ...general, message: "x".repeat(1001), subject: "s".repeat(151) });
  assert.equal(res.status, 400);
  const { errors } = await res.json();
  assert.ok(errors.message && errors.subject);
});

test("header injection via CR/LF in subject / name / email is rejected", async () => {
  for (const field of ["subject", "name", "email"]) {
    const value = field === "email" ? "a@b.com\r\nBcc: evil@x.com" : "Hi\r\nBcc: evil@x.com";
    const res = await post({ ...general, [field]: value });
    assert.equal(res.status, 400, `${field} should be rejected`);
  }
  assert.equal(resendCalls.length, 0);
});

test("multiple-recipient style emails are rejected", async () => {
  for (const email of ["a@b.com,c@d.com", "a@b.com;c@d.com", "<a@b.com>", "a b@c.com"]) {
    const res = await post({ ...general, email });
    assert.equal(res.status, 400, email);
  }
});

test("client-supplied recipient fields are ignored", async () => {
  await post({ ...general, to: "attacker@evil.test", bcc: "attacker@evil.test", cc: "x@y.test" });
  assert.equal(resendCalls[0].body.to, "owner@example.test");
  assert.equal(resendCalls[0].body.bcc, undefined);
  assert.equal(resendCalls[0].body.cc, undefined);
});

test("non-string payload values rejected (no object injection)", async () => {
  const res = await post({ ...general, name: { $gt: "" }, message: ["a"] });
  assert.equal(res.status, 400);
  assert.equal(resendCalls.length, 0);
});

test("HTML in user input is escaped in the HTML body", async () => {
  await post({ ...general, message: "<script>alert(1)</script>", name: "<img src=x onerror=1>" });
  const html = resendCalls[0].body.html;
  assert.ok(!html.includes("<script>alert(1)</script>"));
  assert.ok(!html.includes("<img src=x"));
  assert.ok(html.includes("&lt;script&gt;"));
});

test("honeypot filled -> pretend OK but send nothing", async () => {
  const res = await post({ ...general, website: "http://spam.example" });
  assert.equal(res.status, 200);
  assert.equal(resendCalls.length, 0);
});

test("provider failure -> 500 with generic message, no provider detail or key leaked", async () => {
  resendResponder = () => ({ status: 403, body: { name: "validation_error", message: "domain not verified SECRET-DETAIL", statusCode: 403 } });
  const res = await post(general);
  assert.equal(res.status, 500);
  const text = await res.text();
  assert.ok(!text.includes("SECRET-DETAIL"));
  assert.ok(!text.includes("re_test_key_not_real"));
  assert.ok(!text.includes("stack"), "stack trace must not be exposed unless NODE_ENV=development");
});

test("rate limit: 6th request from one IP within window -> 429", async () => {
  const ip = "10.9.9.9";
  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await post(general, { ip })).status);
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
});

test("malformed JSON -> 400, oversized body -> 413", async () => {
  assert.equal((await post(null, { raw: "{not json" })).status, 400);
  const big = JSON.stringify({ ...general, message: "x".repeat(200 * 1024) });
  assert.equal((await post(null, { raw: big })).status, 413);
});

test("CORS: disallowed origin gets no CORS grant; allowed origin does", async () => {
  const bad = await post(general, { headers: { origin: "https://evil.example" } });
  assert.equal(bad.status, 403);
  assert.equal(bad.headers.get("access-control-allow-origin"), null);
  const good = await post(general, { headers: { origin: "http://localhost:5173" } });
  assert.equal(good.status, 200);
  assert.equal(good.headers.get("access-control-allow-origin"), "http://localhost:5173");
});

test("unknown API route -> 404 JSON", async () => {
  const res = await realFetch(`${base}/api/nope`);
  assert.equal(res.status, 404);
});

test("health endpoint responds without a database", async () => {
  const res = await realFetch(`${base}/api/health`);
  assert.equal(res.status, 200);
});

test("protected admin routes reject anonymous requests", async () => {
  for (const [method, path] of [["GET", "/api/products/admin/all"], ["GET", "/api/reviews/admin/all"], ["POST", "/api/upload"], ["POST", "/api/categories"]]) {
    const res = await realFetch(`${base}${path}`, { method, headers: { "content-type": "application/json" }, body: method === "POST" ? "{}" : undefined });
    assert.equal(res.status, 401, `${method} ${path}`);
  }
});

test("admin login with non-string credentials -> 400, not a crash", async () => {
  const res = await realFetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "10.7.7.7" },
    body: JSON.stringify({ email: ["a@b.com"], password: { $ne: "" } }),
  });
  assert.equal(res.status, 400);
});

test("form-encoded body is not parsed (blocks cross-site HTML-form CSRF on admin POST routes)", async () => {
  const res = await realFetch(`${base}/api/inquiries`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", "x-forwarded-for": "10.8.8.8" },
    body: new URLSearchParams(general).toString(),
  });
  assert.equal(res.status, 400); // body ignored -> validation fails; nothing sent
  assert.equal(resendCalls.length, 0);
});
