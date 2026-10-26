const { cloudinary } = require("../config/cloudinary");

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Uploads a single file buffer to Cloudinary via a stream — avoids writing
// temp files to disk and avoids the multer-storage-cloudinary package,
// which does not support the Cloudinary v2 SDK.
const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "works",
        transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto:good" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

// @desc  Upload one or more product images (admin)
// @route POST /api/upload
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images were received." });
    }

    const invalid = req.files.find((f) => !ALLOWED_TYPES.includes(f.mimetype));
    if (invalid) {
      return res.status(400).json({ success: false, message: "Only JPG, PNG, or WEBP images are allowed." });
    }

    const results = await Promise.all(req.files.map((file) => uploadBufferToCloudinary(file.buffer)));
    const images = results.map((r) => ({ url: r.secure_url, publicId: r.public_id, isMain: false }));
    res.status(201).json({ success: true, message: "Images uploaded successfully.", images });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete an image from Cloudinary (admin)
// @route DELETE /api/upload/:publicId
const deleteImage = async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: "Image deleted." });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImages, deleteImage };
