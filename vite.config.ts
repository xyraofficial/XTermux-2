import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || 'dummy_key',
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

app.post('/api/ai/chat/completions', async (req, res) => {
  try {
    const { messages, model = "gpt-4o" } = req.body;
    const response = await openai.chat.completions.create({
      model,
      messages,
    });
    res.json(response);
  } catch (error) {
    console.error("AI Proxy Error:", error);
    res.status(500).json({ error: "AI Processing Failed" });
  }
});

const aiProxyPlugin = () => ({
  name: 'ai-proxy',
  configureServer(server) {
    server.middlewares.use(app);
  }
});

export default defineConfig({
  plugins: [react(), aiProxyPlugin()],
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
