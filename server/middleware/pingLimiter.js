const rateLimit = require('express-rate-limit');

const pingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "🛸 Already pinged!",
  },

});

module.exports = pingLimiter;
