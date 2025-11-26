// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for toy box settings endpoints
  skip: (req) => {
    return req.path === '/toyBoxSettings' || req.path === '/toyBoxSettings/decrement';
  }
});

module.exports = apiLimiter;
