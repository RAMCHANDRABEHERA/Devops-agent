import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 8000,
    },
    define: {
      // CRITICAL: Check process.env.API_KEY first (for Docker/Cloud Build), then fallback to .env file
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY)
    }
  };
});