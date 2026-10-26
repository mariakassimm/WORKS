require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Fail fast on configuration that would otherwise only break at request time.
const isProd = process.env.NODE_ENV === "production";
const missingRequired = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"].filter((k) => !process.env[k]);
if (missingRequired.length > 0 && isProd) {
  console.error(`[Config] Missing required environment variables: ${missingRequired.join(", ")}`);
  process.exit(1);
}
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn("[Config] JWT_SECRET is shorter than 32 characters — use a long random value in production.");
}
const missingEmail = ["RESEND_API_KEY", "EMAIL_FROM", "BUSINESS_EMAIL"].filter((k) => !process.env[k]);
if (missingEmail.length > 0) {
  console.warn(`[Config] Inquiry emails will fail until these are set: ${missingEmail.join(", ")}`);
}

// Wait for the database connection before accepting any traffic. Starting
// app.listen() immediately (while connectDB() was still connecting in the
// background) meant real requests could arrive during that window, hang for
// Mongoose's ~10s buffering timeout, and then the whole process would exit
// out from under them the moment the connection attempt failed.
connectDB().then(() => {
  app.listen(PORT, () => console.log(`[WORKS API] listening on port ${PORT}`));
});
