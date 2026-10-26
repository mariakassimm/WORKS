// Safe, production-usable admin setup/reset — unlike seed.js, this script
// NEVER touches Product/Category/Review data. Run it any time to create the
// first admin account, or to reset the password for an existing one.
//
// Usage:
//   npm run create-admin              (creates the admin if none exists with this email;
//                                       does nothing if one already exists — safe to re-run)
//   npm run create-admin -- --reset   (also updates the password if the admin already exists)
//
// Reads ADMIN_EMAIL and ADMIN_PASSWORD from the environment — never hard-code
// credentials here or pass them on the command line where they'd end up in
// shell history.

require("dotenv").config();
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("[create-admin] ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("[create-admin] ADMIN_PASSWORD is too short — use at least 8 characters.");
    process.exit(1);
  }

  await connectDB();

  const resetRequested = process.argv.includes("--reset");
  const existing = await Admin.findOne({ email: email.toLowerCase() });

  if (existing) {
    if (!resetRequested) {
      console.log(`[create-admin] An admin already exists for ${email}. No changes made.`);
      console.log("[create-admin] Run with --reset to update this account's password.");
      process.exit(0);
    }
    existing.password = password; // pre('save') hook on the model re-hashes this
    await existing.save();
    console.log(`[create-admin] Password updated for existing admin: ${email}`);
    process.exit(0);
  }

  await Admin.create({ email, password, name: "WORKS Admin" });
  console.log(`[create-admin] Admin account created: ${email}`);
  process.exit(0);
};

run().catch((err) => {
  console.error("[create-admin] Failed:", err.message);
  process.exit(1);
});
