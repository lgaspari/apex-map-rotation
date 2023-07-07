import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/apex-map-rotation/' : '/',
  plugins: [
    VitePWA({
      includeAssets: ['apple-touch-icon.png', 'favicon.ico', 'logo.svg'],
      manifest: {
        name: 'Apex Legends - Map Rotation',
        short_name: 'Apex Map Rotation',
        theme_color: '#DA292A',
        description:
          'Progressive Web Application (PWA) that allows users to subscribe to map change notifications.',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'logo.svg',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
    }),
    tsconfigPaths(),
    svgr(),
    react(),
  ],
  server: {
    https: {
      cert: fs.readFileSync('certs/cert.pem'),
      key: fs.readFileSync('certs/key.pem'),
    },
    host: true,
  },
}));
