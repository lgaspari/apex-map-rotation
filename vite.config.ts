import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  return {
    base: isProduction ? '/apex-map-rotation/' : '/',
    plugins: [
      VitePWA({
        /**
         * Enable PWA while in development mode.
         */
        devOptions: {
          enabled: isDevelopment,
        },

        /**
         * Public resources, no need to include manifest assets.
         */
        includeAssets: ['apple-touch-icon.png', 'favicon.ico', 'robots.txt'],

        /**
         * Manifest configuration.
         *
         * @see https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
         */
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

        /**
         * Even though we prefer updating the Service Worker automatically, we
         * took Vite PWA's advice to use `'prompt'` as register type since it
         * seems dangerous to put the application into production and change
         * behavior from `'autoUpdate'` to `'prompt'` after that.
         *
         * @see https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors.html#service-worker-behaviors
         * @see https://vite-pwa-org.netlify.app/guide/auto-update.html#automatic-reload
         */
        registerType: 'prompt',
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
  };
});
