// ⚠️ DEVELOPMENT ONLY. This script deletes ALL existing products and
// categories every time it runs, then repopulates them with demo data.
// Never run this against a database that contains real business data.
//
// To create or reset the production admin account WITHOUT touching product
// data, use `npm run create-admin` instead (see seed/createAdmin.js).
require("dotenv").config();
const connectDB = require("../config/db");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Admin = require("../models/Admin");
const buildProducts = require("./seedData");

const CATEGORIES = ["Engine Parts", "Body Parts", "Electrical", "Suspension", "Brakes", "Cooling", "Transmission", "Interior", "Exterior"];

const run = async () => {
  await connectDB();

  if (process.argv.includes("--destroy")) {
    await Product.deleteMany();
    await Category.deleteMany();
    console.log("[Seed] All products and categories removed.");
    process.exit(0);
  }

  await Product.deleteMany();
  await Category.deleteMany();
  await Category.insertMany(CATEGORIES.map((name) => ({ name })));
  await Product.insertMany(buildProducts());

  const existingAdmin = await Admin.findOne({});
  if (!existingAdmin) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "change_this_immediately",
      name: "WORKS Admin",
    });
    console.log(`[Seed] Admin account created: ${process.env.ADMIN_EMAIL || "admin@example.com"}`);
  }

  console.log(`[Seed] Inserted ${CATEGORIES.length} categories and ${buildProducts().length} products.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
