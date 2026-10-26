const jwt = require("jsonwebtoken");

// Centralized so the exact same attributes are used when setting AND
// clearing the cookie. clearCookie() with mismatched secure/sameSite
// attributes can silently fail to remove the cookie in some browsers,
// leaving a stale session behind after "logout".
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

const generateToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie(process.env.COOKIE_NAME || "works_admin_token", token, {
    ...cookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = generateToken;
module.exports.cookieOptions = cookieOptions;
