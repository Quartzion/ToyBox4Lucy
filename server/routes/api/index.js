const router = require('express').Router();
const cwuRoutes = require('./cwu-routes');
const ping = require('./ping')

router.use('/', cwuRoutes);
router.use('/', ping);

module.exports = router;