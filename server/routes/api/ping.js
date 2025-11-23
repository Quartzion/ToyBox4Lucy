const router = require('express').Router();
const pingLimiter = require('../../middleware/pingLimiter');
const redis = require('../../redisClient');

router.get('/ping', pingLimiter, async (req, res) => {
  try {
    const isAwake = await redis.get('serverAwake');

    if (isAwake) {
      return res.status(200).json({
        status: 'awake',
        message: 'Server already awake',
        cache: true,
        serverTime: new Date().toISOString(),
        uptime: process.uptime(),
      });
    }

    // Set the flag with a TTL of 15 mins
    await redis.set('serverAwake', 'true', 'EX', 15 * 60);

    return res.status(200).json({
      status: 'just woke up',
      message: 'Server was asleep, now awake',
      cache: false,
      serverTime: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (err) {
    console.error('Redis Error', err);
    return res.status(500).json({ error: 'Internal Service Error' });
  }
});

module.exports = router;
