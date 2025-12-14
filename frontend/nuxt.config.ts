import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  supabase: {
    redirect: false, // We will handle redirection manually in middleware
  },
  runtimeConfig: {
    public: {
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'https://e-learning-1-qvk8.onrender.com',
      NUXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL || 'https://hnruyktmlqskqqipjcrc.supabase.co',
      NUXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnV5a3RtbHFza3FxaXBqY3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODkwODksImV4cCI6MjA4MDk2NTA4OX0.LZGoNmAE6qjksg2ugEnVHUdWpNX3k2pngrQ-x-6QZSk',
    }
  },
  compatibilityDate: '2024-01-01',
  devtools: { enabled: true },
  vite: {
    server: {
      fs: {
        allow: [
          path.resolve(__dirname, '..')
        ]
      }
    }
  }
})
