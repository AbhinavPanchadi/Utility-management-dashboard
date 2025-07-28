import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '^/roles': 'http://localhost:8000',
      '^/permissions': 'http://localhost:8000',
      '^/user-role-permissions': 'http://localhost:8000',
      '^/users': 'http://localhost:8000',
    },
  },
});