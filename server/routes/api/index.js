const router = require('express').Router();
const cwuRoutes = require('./cwu-routes');
const toyBoxSettingsRoutes = require('./toyBoxData-routes')
const ping = require('./ping')

router.use('/', cwuRoutes);
router.use('/', toyBoxSettingsRoutes);
router.use('/', ping);

module.exports = router;