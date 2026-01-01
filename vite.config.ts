import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
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