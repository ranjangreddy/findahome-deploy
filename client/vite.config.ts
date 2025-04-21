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
      '/api': {
        target: `https://findahome-r5ta6i2rl-ranjangreddys-projects.vercel.app/`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
