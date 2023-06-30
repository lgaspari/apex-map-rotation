import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

//vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/apex-map-rotation/' : '/',
  plugins: [tsconfigPaths(), svgr(), react()],
}));
