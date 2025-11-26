const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// POST /api/admin/login
router.post('/admin/login', async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ message: 'Password required' });

  try {
    // Prefer hashed password in env
    const hash = process.env.ADMIN_PASSWORD_HASH;
    const legacy = process.env.ADMIN_PASSWORD;

    let ok = false;
    if (hash) {
      ok = await bcrypt.compare(password, hash);
    } else if (legacy) {
      ok = password === legacy;
    }

    if (!ok) return res.status(403).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ role: 'admin' }, process.env.JWTSECRET || 'devsecret', { expiresIn: '1h' });

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ message: 'ok' });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/logout
router.post('/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ message: 'logged out' });
});

module.exports = router;
