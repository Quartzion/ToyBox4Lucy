const router = require('express').Router();
const cwuRoutes = require('./cwu-routes');
const toyBoxSettingsRoutes = require('./toyBoxData-routes')
const ping = require('./ping')
const adminAuthRoutes = require('./admin-auth');

router.use('/', cwuRoutes);
router.use('/', toyBoxSettingsRoutes);
router.use('/', ping);
router.use('/', adminAuthRoutes);

module.exports = router;