import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import { fileURLToPath, URL } from 'node:url';

// Public site URL for canonical, Open Graph and JSON-LD tags in index.html.
// Override with VITE_SITE_URL when the site moves to its own domain.
process.env.VITE_SITE_URL ??= 'https://fouad-barkaoui.vercel.app';

export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
});
