import { defineConfig } from '@playwright/test';

const previewCommand =
  'VITE_PWA_ENABLED=true vite build && VITE_PWA_ENABLED=false vite preview --port 4173 --strictPort --host 127.0.0.1';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://127.0.0.1:4173/apex-map-rotation/',
  },
  webServer: {
    command: previewCommand,
    url: 'http://127.0.0.1:4173/apex-map-rotation/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
