import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    https: {
      cert: fs.readFileSync('certs/server.pem'),
      key: fs.readFileSync('certs/server-key.pem'),
    },
  },
  plugins: [
    VitePWA({
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      includeAssets: ['apple-touch-icon.png', 'favicon.ico'],
      manifest: {
        name: 'APEX Mapy',
        short_name: 'APEX Mapy',
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
            src: 'vite.svg',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    react(),
  ],
});
