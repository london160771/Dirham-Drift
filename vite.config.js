import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const testJsx = { esbuild: { jsx: 'automatic' } };

const manifest = {
  name: 'Dirham Drift',
  short_name: 'Dirham Drift',
  description: "Race for money. Don't let money race you.",
  start_url: './',
  scope: './',
  display: 'fullscreen',
  orientation: 'landscape',
  background_color: '#0b0d14',
  theme_color: '#0b0d14',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};

const pwa = VitePWA({
  injectRegister: false,
  registerType: 'autoUpdate',
  includeAssets: ['icons/apple-touch-icon.png', 'icons/icon.svg'],
  manifest,
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,svg,mp3,woff2,webp,jpg,avif}'],
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
    navigateFallback: 'index.html',
  },
});

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'test' ? [] : [pwa])],
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
