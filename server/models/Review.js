const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, maxlength: 600 },
    status: { type: String, enum: ["pending", "approved", "hidden"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
