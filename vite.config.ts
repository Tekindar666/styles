import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'preview-dist',
    rollupOptions: {
      input: 'zen/preview.html',
    },
  },
});
