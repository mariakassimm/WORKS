const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimit");
const { login, logout, getMe } = require("../controllers/authController");

router.post("/login", loginLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
