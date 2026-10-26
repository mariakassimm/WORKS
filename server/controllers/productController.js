const Product = require("../models/Product");

const getProducts = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true });
    if (!product) return res.status(404).json({ success: false, message: "This part is no longer available." });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: "Part added successfully.", product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Part not found." });
    res.json({ success: true, message: "Part updated successfully.", product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Part not found." });
    res.json({ success: true, message: "Part removed successfully." });
  } catch (err) {
    next(err);
  }
};

const toggleVisibility = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Part not found." });
    product.isPublished = !product.isPublished;
    await product.save();
    res.json({ success: true, message: product.isPublished ? "Part is now visible." : "Part is now hidden.", product });
  } catch (err) {
    next(err);
  }
};

const getStats = async (req, res, next) => {
  try {
    const [total, featured, inStock, categories] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ availability: "in_stock" }),
      Product.distinct("category"),
    ]);
    res.json({ success: true, stats: { total, featured, inStock, categoryCount: categories.length } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts, getProductBySlug, getAllProductsAdmin, createProduct,
  updateProduct, deleteProduct, toggleVisibility, getStats,
};
