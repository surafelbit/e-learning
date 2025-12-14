# Deployment Guide for BrainBite

This guide will walk you through deploying both the frontend and backend of BrainBite to production.

## Prerequisites

- Node.js (v18+) installed
- A Supabase project set up with the database schema
- An OpenAI API key
- Accounts on deployment platforms:
  - **Frontend**: Vercel (recommended) or Netlify
  - **Backend**: Render (recommended), Railway, or Fly.io

## Pre-Deployment Checklist

✅ Both applications have been built successfully:
- Backend: `cd backend && npm run build` ✅
- Frontend: `cd frontend && npm run build` ✅

✅ CORS has been configured in the backend to allow frontend requests

## Step 1: Deploy the Backend

### Option A: Deploy to Render (Recommended - Free Tier Available)

1. **Create a Render Account**
   - Go to [render.com](https://render.com) and sign up

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `brainbite-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start:prod`
     - **Plan**: Free (or choose a paid plan)

3. **Add Environment Variables**
   In the Render dashboard, add these environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   AI_API_KEY=sk-your-openai-key
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
   ⚠️ **Important**: Set `FRONTEND_URL` after deploying the frontend (Step 2)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for the build to complete
   - Copy your backend URL (e.g., `https://brainbite-backend.onrender.com`)

### Option B: Deploy to Railway

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app) and sign up

2. **Create a New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure the Service**
   - Railway will auto-detect the backend folder
   - The `railway.json` file is already configured
   - Add environment variables (same as Render above)

4. **Deploy**
   - Railway will automatically deploy
   - Copy your backend URL

### Option C: Deploy to Fly.io

1. **Install Fly CLI**
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login and Create App**
   ```bash
   cd backend
   fly auth login
   fly launch
   ```

3. **Set Environment Variables**
   ```bash
   fly secrets set SUPABASE_URL=https://your-project.supabase.co
   fly secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   fly secrets set SUPABASE_JWT_SECRET=your-jwt-secret
   fly secrets set AI_API_KEY=sk-your-openai-key
   fly secrets set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

## Step 2: Deploy the Frontend

### Option A: Deploy to Vercel (Recommended - Best for Frontend)

**Note**: Vercel is optimized for frontend frameworks like Nuxt and provides the best experience. Render is better suited for backend services.

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com) and sign up
   - Connect your GitHub account

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure the Project**
   - **Framework Preset**: Nuxt.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.output/public` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**
   ```
   NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NUXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
   ```
   ⚠️ **Important**: Use your actual backend URL from Step 1

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Copy your frontend URL (e.g., `https://brainbite.vercel.app`)

6. **Update Backend CORS**
   - Go back to your backend deployment (Render/Railway/Fly.io)
   - Update the `FRONTEND_URL` environment variable to your Vercel URL
   - Redeploy the backend if needed

### Option B: Deploy to Netlify

1. **Create a Netlify Account**
   - Go to [netlify.com](https://netlify.com) and sign up

2. **Import Your Project**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.output/public`

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add the same variables as Vercel (above)

5. **Deploy**
   - Click "Deploy site"
   - Copy your frontend URL

### Option C: Deploy Frontend to Render (Alternative)

**Note**: While Render works, Vercel/Netlify are better optimized for frontend. Use this option if you prefer to keep everything on Render.

1. **Create a Static Site on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure the Static Site**
   - **Name**: `brainbite-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `.output/public`

3. **Add Environment Variables**
   ```
   NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NUXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for build to complete
   - Copy your frontend URL

**Important Fix Applied**: The `postinstall` script has been removed from `package.json` to fix the native binding error (`oxc-parser`) that occurs on Render's Linux environment. The build process will handle preparation automatically.

## Step 3: Update Environment Variables

After both are deployed, make sure:

1. **Backend** has `FRONTEND_URL` set to your frontend deployment URL
2. **Frontend** has `NUXT_PUBLIC_BACKEND_URL` set to your backend deployment URL

## Step 4: Verify Deployment

1. **Test the Frontend**
   - Visit your frontend URL
   - Try logging in with Supabase Auth
   - Generate a course

2. **Test the Backend**
   - Check backend health: `https://your-backend-url.com/` (should return API info)
   - Verify CORS is working (no CORS errors in browser console)

3. **Common Issues**
   - **CORS Errors**: Make sure `FRONTEND_URL` in backend matches your frontend URL exactly
   - **401 Unauthorized**: Check Supabase keys are correct
   - **500 Errors**: Check backend logs for missing environment variables

## Environment Variables Reference

### Backend Required Variables
```
NODE_ENV=production
PORT=10000 (or platform default)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
AI_API_KEY=sk-your-openai-key
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend Required Variables
```
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NUXT_PUBLIC_BACKEND_URL=https://your-backend-url.onrender.com
```

## Quick Deployment Commands

### Build Locally (for testing)
```bash
# Backend
cd backend
npm install
npm run build

# Frontend
cd frontend
npm install
npm run build
```

### Test Production Build Locally
```bash
# Backend
cd backend
npm run start:prod

# Frontend
cd frontend
npm run preview
```

## Deployment URLs Summary

After deployment, you should have:
- **Frontend URL**: `https://your-app.vercel.app` (or netlify.app)
- **Backend URL**: `https://your-backend.onrender.com` (or railway.app, fly.dev)

## Support

If you encounter issues:
1. Check deployment logs in your platform dashboard
2. Verify all environment variables are set correctly
3. Ensure Supabase database schema is set up
4. Check that both services are running and accessible

---

**Note**: Free tiers may have cold starts or rate limits. Consider upgrading for production use.

