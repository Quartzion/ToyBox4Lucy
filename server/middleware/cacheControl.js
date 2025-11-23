// middleware/cacheControl.js
module.exports = function noCache(req, res, next) {
  res.set({
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
};
