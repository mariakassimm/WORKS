const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/auth");
const { uploadImages, deleteImage } = require("../controllers/uploadController");

// Files are held in memory only long enough to stream to Cloudinary — never written to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per image
});

router.post("/", protect, upload.array("images", 10), uploadImages);
router.delete("/:publicId", protect, deleteImage);

module.exports = router;
