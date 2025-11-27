const router = require('express').Router();
const cwuRoutes = require('./cwu-routes');
console.log("Loaing toyBoxData-routes.");
const tbdRoutes = require('./tbd-routes');
console.log("Loaded toyBoxData-routes.");
const ping = require('./ping')
const adminAuthRoutes = require('./admin-auth');

router.use('/', cwuRoutes);
router.use('/', tbdRoutes);
router.use('/', ping);
router.use('/', adminAuthRoutes);

module.exports = router;