Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        MODE: 'test',
        VITE_PROD_API_BASE_URL: 'https://prod.api',
        VITE_DEV_API_BASE_URL: 'http://localhost',
        VITE_PORT: '3000',
      }
    }
  }
});
