const mongoose = require("mongoose");
const slugify = require("slugify");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    isMain: { type: Boolean, default: false },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Part name is required"], trim: true, maxlength: 120 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: [true, "Description is required"], trim: true },
    shortDescription: { type: String, trim: true, maxlength: 160 },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    images: { type: [imageSchema], default: [] },
    category: { type: String, required: [true, "Category is required"], trim: true },
    condition: { type: String, enum: ["used", "refurbished", "new"], default: "used" },
    vehicleMake: { type: String, trim: true },
    vehicleModel: { type: String, trim: true },
    compatibleYears: { type: String, trim: true },
    specifications: [{ label: { type: String, trim: true }, value: { type: String, trim: true }, _id: false }],
    featured: { type: Boolean, default: false },
    availability: { type: String, enum: ["in_stock", "reserved", "sold"], default: "in_stock" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.pre("validate", function (next) {
  // Only generate a slug once, when the product is first created. Without
  // this guard, re-validating an existing document (e.g. on every edit)
  // would silently regenerate the slug and change the product's public
  // URL each time it's saved, breaking any bookmarked or shared links.
  if (this.isNew && this.name) {
    this.slug = slugify(`${this.name}-${Date.now().toString().slice(-5)}`, { lower: true, strict: true });
  }
  next();
});

productSchema.index({ name: "text", description: "text", category: 1 });

module.exports = mongoose.model("Product", productSchema);
