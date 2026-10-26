const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getCategories, createCategory, updateCategory, deleteCategory, getCategoryUsage } = require("../controllers/categoryController");

router.get("/", getCategories);
router.get("/usage", protect, getCategoryUsage);
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;
