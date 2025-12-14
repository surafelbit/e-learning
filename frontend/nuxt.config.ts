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
      backendUrl: process.env.NUXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
      NUXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
      NUXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_KEY,
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
