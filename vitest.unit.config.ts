/// <reference types="vitest/config" />

import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      exclude: ['src/main.tsx', ...coverageConfigDefaults.exclude],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'istanbul',
    },
    include: ['src/**/*.spec.ts'],
  },
});
