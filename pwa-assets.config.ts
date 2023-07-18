import { defineConfig } from '@vite-pwa/assets-generator/config';

/**
 * We use minimal Vite PWA Assets Generator configuration, plus a 48x48 favicon
 * instead of 64x64.
 *
 * @note Please delete the file called `public/pwa-48x48.png` after generation (https://github.com/vite-pwa/assets-generator/issues/5)
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
      sizes: [48, 64, 192, 512],
    },
  },
});
