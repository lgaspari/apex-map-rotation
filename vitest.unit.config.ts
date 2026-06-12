/// <reference types="vitest/config" />

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, 'src');

export default defineConfig({
  plugins: [tsconfigPaths({ root: __dirname })],
  resolve: {
    alias: {
      constants: path.join(src, 'constants'),
      lib: path.join(src, 'lib'),
      types: path.join(src, 'types'),
    },
  },
  test: {
    coverage: {
      exclude: ['src/main.tsx', ...coverageConfigDefaults.exclude],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'istanbul',
    },
    include: ['tests/**/*.spec.ts'],
  },
});
