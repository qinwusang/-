import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: This makes the app work in a file system (file://) without a server
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});