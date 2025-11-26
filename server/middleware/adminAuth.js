require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Middleware to authenticate admin requests
// Preferred path: validate HttpOnly JWT cookie set at login
// Fallback: accept adminPassword in body/query/header and compare against ADMIN_PASSWORD_HASH or legacy ADMIN_PASSWORD
const adminAuth = async (req, res, next) => {
  // 1) Try JWT cookie or Authorization header
  try {
    const token = req.cookies?.admin_token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWTSECRET || 'devsecret');
        if (payload && payload.role === 'admin') return next();
      } catch (err) {
        // token invalid or expired - fall through to fallback
      }
    }
  } catch (err) {
    // ignore and try fallback
  }

  // 2) Fallback to password compare
  const provided = req.body?.adminPassword || req.query?.adminPassword || req.headers['x-api-secret'];
  if (!provided) {
    return res.status(400).json({ message: 'Admin credentials required' });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  const legacy = process.env.ADMIN_PASSWORD;
  try {
    if (hash) {
      const ok = await bcrypt.compare(provided, hash);
      if (!ok) return res.status(403).json({ message: 'Invalid admin password' });
      return next();
    }
    if (legacy) {
      if (provided !== legacy) return res.status(403).json({ message: 'Invalid admin password' });
      return next();
    }
    console.error('No admin password configured');
    return res.status(500).json({ message: 'Server configuration error' });
  } catch (err) {
    console.error('adminAuth error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminAuth;
