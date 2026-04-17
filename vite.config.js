import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // In production, the frontend talks directly to the Render backend.
  // In development, Vite proxies /api → localhost:3001.
  const apiTarget = env.VITE_API_URL || 'http://localhost:3001';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
      watch: { ignored: ['**/.local/**'] },
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  };
});
