const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Incorrect email or password." });
    }
    generateToken(res, admin._id);
    res.json({ success: true, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || "works_admin_token", generateToken.cookieOptions());
  res.json({ success: true, message: "Logged out." });
};

const getMe = (req, res) => {
  res.json({ success: true, admin: { id: req.admin._id, email: req.admin.email, name: req.admin.name } });
};

module.exports = { login, logout, getMe };
