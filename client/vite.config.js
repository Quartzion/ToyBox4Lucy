import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();
const vPort = parseInt(process.env.VITE_PORT);
const PORT = process.env.PORT;

import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
        outDir: 'build',
    },
    rollupOptions: {
        input: {
            main: 'index.html'
        }
    },
    server: {
        port: vPort,
        open: true,
        proxy: {
            '/api': `http://localhost:${PORT}`
        }
    }
});