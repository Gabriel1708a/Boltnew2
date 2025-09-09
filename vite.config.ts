import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 2070,
    host: '0.0.0.0', // Permite acesso externo
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
