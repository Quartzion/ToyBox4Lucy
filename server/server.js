require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
const express = require('express');
const cors = require('cors');
const apiLimiter = require('./middleware/rateLimiter');
const noCache = require('./middleware/cacheControl');
const { swaggerUi, specs } = require('./swagger');
const compression = require('compression');
const path = require('path');
const db = require('./config/connection')
const routes = require('./routes')

const PORT = process.env.PORT || 3000;
const VITE_PORT = process.env.VITE_PORT;
const CORS_PROD = process.env.PROD_FRONTEND;
const app = express();
app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Redis connection test
async function testRedis() {
  await redis.set("hello", "REDIS_URL Success");
  const val = await redis.get("hello");
  console.log("Value from Redis:", val);
}

testRedis();

// CORS
const allowedOrigins = [
  `http://localhost:${VITE_PORT}`,
  `${CORS_PROD}`
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('[CORS] Request origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('[CORS] Blocked request from:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  }
  ,
  credentials: true
}));

// rate limiter + noCache
app.use('/api', apiLimiter, noCache);

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Enable GZIP / Brotli compression
app.use(compression());

// Serve static files with custom cache behavior
// const buildPath = path.join(__dirname, '../client/build');
// app.use(express.static(buildPath, {
//   etag: false,
//   setHeaders: (res, filePath) => {
//     if (filePath.endsWith('.html')) {
//       res.setHeader('Cache-Control', 'no-cache');
//     } else {
//       res.setHeader('Cache-Control', 'public, max-age=31536000');
//     }
//   }
// }));

app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => console.log(`🛸 Now listening on localhost:${PORT}`));
});

// SPA fallback for React Router
// app.get('*', (req, res) => {
//   res.sendFile(path.join(buildPath, 'index.html'));
// });
