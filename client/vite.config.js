import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Disable dependency optimization
  process.env.VITE_DISABLE_OPTIMIZATION = 'true';
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Proxy API requests to the backend
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        },
        // Proxy media files in development
        '/media': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    // Define global constants
    define: {
      'process.env': { 
        ...env,
        VITE_DISABLE_OPTIMIZATION: 'true'
      },
    },
    optimizeDeps: {
      // Disable pre-bundling of dependencies
      include: [],
      exclude: []
    },
    build: {
      // Disable source maps for faster builds
      sourcemap: false,
      // Disable minification for debugging
      minify: false,
      // Increase build timeout
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {}
        }
      }
    },
  };
});
