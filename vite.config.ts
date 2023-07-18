import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const withEnvironment = (value: string) =>
    value.concat(mode === 'development' ? ' (DEV)' : '');

  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    // Changes base url depending on the build mode.
    base: mode === 'production' ? '/apex-map-rotation/' : '/',

    // Simplifies the process of creating a PWA/Service Worker enabled app.
    plugins: [
      VitePWA({
        // Enable PWA while in development mode.
        devOptions: {
          enabled: true,
        },

        // Disable PWA based on environment variable
        disable: env.VITE_PWA_ENABLED !== 'true',

        // Public resources, no need to include manifest assets.
        includeAssets: [
          'apple-touch-icon-180x180',
          'favicon.ico',
          'logo.svg',
          'robots.txt',
        ],

        // Manifest configuration.
        // https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html
        manifest: {
          name: withEnvironment('Apex Legends - Map Rotation'),
          short_name: withEnvironment('Map Rotation'),
          theme_color: '#DA292A',
          description:
            'Progressive Web Application (PWA) that allows users to subscribe to map change notifications.',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },

        /**
         * Even though we'd prefer updating the Service Worker automatically,
         * we took Vite PWA's advice to use `'prompt'` as register type since
         * it seems dangerous to put the application into production and change
         * its behavior from `'autoUpdate'` to `'prompt'` after that.
         *
         * @see https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors.html#service-worker-behaviors
         * @see https://vite-pwa-org.netlify.app/guide/auto-update.html#automatic-reload
         */
        registerType: 'prompt',
      }),

      // Let's Vite understand non-relative imports via baseUrl or paths.
      tsconfigPaths(),

      // Allows importing svgs as React components.
      // e.g. import { ReactComponent as Logo } from './logo.svg'
      svgr(),

      // Enables fast refresh and jsx runtime (no import React).
      react(),
    ],

    // Local server configuration.
    server: {
      host: true,
    },
  };
});
