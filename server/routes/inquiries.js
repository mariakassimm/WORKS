const express = require("express");
const router = express.Router();
const { inquiryLimiter } = require("../middleware/rateLimit");
const { submitInquiry } = require("../controllers/inquiryController");

router.post("/", inquiryLimiter, submitInquiry);

module.exports = router;
