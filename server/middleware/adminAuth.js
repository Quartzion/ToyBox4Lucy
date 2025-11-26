require('dotenv').config();

// Middleware to authenticate admin requests
// Accepts adminPassword from request body, query parameter, or x-api-secret header
const adminAuth = (req, res, next) => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD environment variable not set");
    return res.status(500).json({
      message: "Server configuration error"
    });
  }

  // Check for password in body first, then query param, then header
  const password = req.body?.adminPassword || req.query?.adminPassword || req.headers['x-api-secret'];

  if (!password) {
    return res.status(400).json({
      message: "Admin password is required"
    });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({
      message: "Invalid admin password"
    });
  }

  // Password is valid, continue to next middleware/route
  next();
};

module.exports = adminAuth;
