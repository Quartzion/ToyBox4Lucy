require('dotenv').config();
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const VITE_PORT = process.env.VITE_PORT;
const VITE_QTS_VERSION = process.env.VITE_QTS_VERSION;

// Determine API base URL
const isProd = process.env.NODE_ENV === 'production';

// Prefer explicit env var, fallback to hardcoded defaults
const serverUrl = isProd
  ? process.env.SWAGGER_BASE_URL || 'https://quartzion-api.onrender.com/api'
  : `http://localhost:${VITE_PORT}/api`;

// Absolute paths for swaggerJsdoc to avoid working directory issues
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quartzion API',
      version: `${VITE_QTS_VERSION}`,
      description: 'API documentation for Quartzion Engineering',
    },
    servers: [
      {
        url: serverUrl,
        description: isProd ? 'Production server' : 'Local development server',
      },
    ],
  },
  apis: [
    path.join(__dirname, 'routes/api/*.js'),
    path.join(__dirname, 'controllers/*.js'),
    path.join(__dirname, 'models/*.js'),
  ],
};

const specs = swaggerJsdoc(options);

// Optional: debug which files are being picked up (remove for production)
const glob = require('glob');
const apiFiles = [
  path.join(__dirname, 'routes/api/*.js'),
  path.join(__dirname, 'controllers/*.js'),
  path.join(__dirname, 'models/*.js'),
];
apiFiles.forEach(f => {
  console.log('[Swagger Debug] Matching files for', f, ':', glob.sync(f));
});

module.exports = {
  swaggerUi,
  specs,
};