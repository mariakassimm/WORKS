const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getProducts, getProductBySlug, getAllProductsAdmin, createProduct,
  updateProduct, deleteProduct, toggleVisibility, getStats,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/admin/all", protect, getAllProductsAdmin);
router.get("/admin/stats", protect, getStats);
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.patch("/:id/visibility", protect, toggleVisibility);
router.get("/:slug", getProductBySlug);

module.exports = router;
