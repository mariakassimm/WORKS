require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const { notFound, errorHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimit");

const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/upload");
const inquiryRoutes = require("./routes/inquiries");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(mongoSanitize());

const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Image uploads use multipart (multer) and are unaffected by this limit.
app.use(express.json({ limit: "100kb" }));
// Deliberately NO express.urlencoded(): the site only sends JSON/multipart, and
// accepting form-encoded bodies would let a cross-site HTML form (no CORS
// preflight) trigger admin POST routes using the SameSite=None session cookie.
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => res.json({ success: true, message: "WORKS API is running." }));
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
