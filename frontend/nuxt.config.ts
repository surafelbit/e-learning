import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  supabase: {
    redirect: false,
    url: 'https://hnruyktmlqskqqipjcrc.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnV5a3RtbHFza3FxaXBqY3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzODkwODksImV4cCI6MjA4MDk2NTA4OX0.LZGoNmAE6qjksg2ugEnVHUdWpNX3k2pngrQ-x-6QZSk',
  },
  runtimeConfig: {
    public: {
      backendUrl: 'https://e-learning-4-f386.onrender.com',
    }
  },//ok
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
