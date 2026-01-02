import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-markdown', '@supabase/supabase-js'],
          'icons': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || process.env.GROQ_API_KEY || ''),
    'process.env.GROQ_API_KEY': JSON.stringify(process.env.GROQ_API_KEY || ''),
  }
});