import { defineConfig } from '@vite-pwa/assets-generator/config';

/**
 * We use minimal Vite PWA Assets Generator configuration, plus a 48x48 favicon
 * instead of 64x64.
 *
 * @see https://vite-pwa-org.netlify.app/assets-generator/cli.html#configurations
 */
export default defineConfig({
  images: ['public/logo.svg'],
  preset: {
    apple: {
      sizes: [180],
    },
    maskable: {
      sizes: [512],
    },
    transparent: {
      favicons: [[48, 'favicon.ico']],
      sizes: [64, 192, 512],
    },
  },
});
