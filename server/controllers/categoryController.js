const Category = require("../models/Category");
const Product = require("../models/Product");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (err) { next(err); }
};

// Case-insensitive duplicate check — MongoDB's unique index on `name` is
// case-sensitive, so without this, "Engine Parts" and "engine parts" would
// be silently accepted as two different categories.
const findCaseInsensitiveDuplicate = async (name, excludeId = null) => {
  const filter = { name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" } };
  if (excludeId) filter._id = { $ne: excludeId };
  return Category.findOne(filter);
};

const createCategory = async (req, res, next) => {
  try {
    const name = String(req.body.name ?? "").trim();
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required." });
    }
    if (name.length > 60) {
      return res.status(400).json({ success: false, message: "Category name must be under 60 characters." });
    }

    const duplicate = await findCaseInsensitiveDuplicate(name);
    if (duplicate) {
      return res.status(400).json({ success: false, message: `A category named "${duplicate.name}" already exists.` });
    }

    const category = await Category.create({ name });
    res.status(201).json({ success: true, message: "Category added.", category });
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const name = String(req.body.name ?? "").trim();
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required." });
    }
    if (name.length > 60) {
      return res.status(400).json({ success: false, message: "Category name must be under 60 characters." });
    }

    const duplicate = await findCaseInsensitiveDuplicate(name, req.params.id);
    if (duplicate) {
      return res.status(400).json({ success: false, message: `A category named "${duplicate.name}" already exists.` });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });
    res.json({ success: true, message: "Category updated.", category });
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });

    await category.deleteOne();
    res.json({ success: true, message: "Category removed." });
  } catch (err) { next(err); }
};

// @desc  Count how many products currently use each category name, so the
// admin can see this before deleting (products store category as a plain
// string, not a reference, so deleting a category never breaks a product —
// but the admin should still be able to make an informed choice).
// @route GET /api/categories/usage
const getCategoryUsage = async (req, res, next) => {
  try {
    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const usage = {};
    counts.forEach((c) => { usage[c._id] = c.count; });
    res.json({ success: true, usage });
  } catch (err) { next(err); }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, getCategoryUsage };
