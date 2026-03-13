import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host:true,
    port: 5173,
    open: true,
    allowHosts: ['localhost', '127.0.0.1', '0.0.0.0'],
  },
  build: {
    outDir: 'dist',
  },
});
