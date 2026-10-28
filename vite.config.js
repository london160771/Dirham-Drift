import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const testJsx = { esbuild: { jsx: 'automatic' } };

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react()],
  ...(mode === 'test' ? testJsx : {}),
  build: {
    chunkSizeWarningLimit: 1400,
  },
  test: {
    projects: [
      { extends: true, test: { name: 'logic', environment: 'node', include: ['tests/**/*.test.js'] } },
      { extends: true, test: { name: 'screens', environment: 'jsdom', include: ['tests/**/*.test.jsx'] } },
    ],
  },
}));
