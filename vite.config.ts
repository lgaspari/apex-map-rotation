import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/apex-map-rotation/' : '/',
  plugins: [tsconfigPaths(), svgr(), react()],
  server: {
    https: {
      cert: fs.readFileSync('certs/cert.pem'),
      key: fs.readFileSync('certs/key.pem'),
    },
    host: true,
  },
}));
