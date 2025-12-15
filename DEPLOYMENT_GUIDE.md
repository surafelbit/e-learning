# Complete Deployment Guide: Brain-Bite

This guide covers deploying your **backend (NestJS) on Render** and **frontend (Nuxt) on Vercel**.

---

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Supabase Account**: You need your Supabase URL and keys
3. **AI API Key** (optional): OpenAI or Groq API key for course generation
4. **Render Account**: Sign up at [render.com](https://render.com) (free tier available)
5. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)

---

## 🚀 Part 1: Deploy Backend on Render

### Step 1: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (`surafelbit/e-learning`)
4. Give it a name: `brain-bite-backend` (or any name you prefer)

### Step 2: Configure Build Settings

In the **Build & Deploy** section:

- **Environment**: `Node`
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your main branch name)
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`

### Step 3: Set Environment Variables

Go to **Environment** section and add these variables:

| Key | Value | Where to Find |
|-----|-------|---------------|
| `SUPABASE_URL` | `https://hnruyktmlqskqqipjcrc.supabase.co` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | Supabase Dashboard → Settings → API → `service_role` key |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API → `anon` key |
| `AI_API_KEY` | `sk-...` or `gsk_...` | Your OpenAI or Groq API key (optional, will use mock data if empty) |

**⚠️ Important Notes:**
- `SUPABASE_SERVICE_ROLE_KEY` is secret - never commit it to GitHub
- `AI_API_KEY` is optional - if you don't provide it, the app will use mock course data
- Render will automatically set `PORT` - your code already handles this

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building automatically
3. Wait for the build to complete (usually 2-5 minutes)
4. Once deployed, you'll get a URL like: `https://brain-bite-backend-xxxx.onrender.com`
5. **Copy this URL** - you'll need it for the frontend

### Step 5: Test Your Backend

Visit your Render URL in a browser. You should see:
```
Hello World!
```

If you see that, your backend is working! ✅

---

## 🎨 Part 2: Deploy Frontend on Vercel

### Step 1: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (`surafelbit/e-learning`)
4. Click **"Import"**

### Step 2: Configure Project Settings

In the **Configure Project** screen:

- **Framework Preset**: Vercel should auto-detect `Nuxt.js` ✅
- **Root Directory**: Click **"Edit"** and set to `frontend` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `.output/public` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

### Step 3: Set Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `NUXT_PUBLIC_BACKEND_URL` | `https://e-learning-4-f386.onrender.com` (or your Render backend URL) |

**Note**: This will override the hardcoded value in `nuxt.config.ts` for production.

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy automatically (usually 1-3 minutes)
3. Once done, you'll get a URL like: `https://brain-bite.vercel.app`
4. **Your app is live!** 🎉

---

## 🔧 Part 3: Post-Deployment Checklist

### Backend (Render)

- [ ] Test backend URL: `https://e-learning-4-f386.onrender.com/` shows "Hello World!"
- [ ] Check Render logs for any errors
- [ ] Verify environment variables are set correctly

### Frontend (Vercel)

- [ ] Visit your Vercel URL
- [ ] Test signup/login flow
- [ ] Test course generation
- [ ] Check browser console for any errors
- [ ] Verify API calls are going to your Render backend URL

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Build fails with "Missing script: build"
- **Solution**: Make sure **Root Directory** is set to `backend` in Render settings

**Problem**: Backend returns 500 errors
- **Solution**: Check Render logs → check if environment variables are set correctly

**Problem**: Backend spins down after inactivity
- **Solution**: This is normal on Render free tier. First request after inactivity takes ~50 seconds. Consider upgrading to paid plan for always-on service.

### Frontend Issues

**Problem**: Frontend can't connect to backend
- **Solution**: 
  1. Check `NUXT_PUBLIC_BACKEND_URL` in Vercel environment variables
  2. Make sure backend URL doesn't have trailing slash
  3. Check browser console for CORS errors (backend should have CORS enabled ✅)

**Problem**: Build fails on Vercel
- **Solution**: 
  1. Make sure **Root Directory** is set to `frontend`
  2. Check Vercel build logs for specific error
  3. Ensure `package.json` has correct scripts

**Problem**: Supabase auth not working
- **Solution**: 
  1. Check Supabase URL and keys in `nuxt.config.ts` (hardcoded) or Vercel env vars
  2. Make sure Supabase project has email confirmation **disabled** (Settings → Authentication → Email)

---

## 📝 Important Notes

### Render Free Tier Limitations

- **Spins down after 15 minutes of inactivity**
- **First request after spin-down takes ~50 seconds** (cold start)
- **Upgrade to paid plan** ($7/month) for always-on service

### Vercel Free Tier

- **Unlimited deployments**
- **Automatic HTTPS**
- **Global CDN**
- **No spin-down** - always available

### Environment Variables Priority

1. **Vercel Environment Variables** (highest priority for production)
2. **nuxt.config.ts** (fallback/default)
3. **Local .env files** (development only)

---

## 🔄 Updating Your Deployment

### To Update Backend:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update backend"
   git push origin main
   ```
3. Render will **automatically redeploy** (if auto-deploy is enabled)

### To Update Frontend:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push origin main
   ```
3. Vercel will **automatically redeploy** (if auto-deploy is enabled)

---

## ✅ Final Checklist

Before going live, make sure:

- [ ] Backend is deployed on Render and accessible
- [ ] Frontend is deployed on Vercel and accessible
- [ ] All environment variables are set correctly
- [ ] Supabase email confirmation is **disabled**
- [ ] Test signup/login flow works
- [ ] Test course generation works
- [ ] Test viewing courses works
- [ ] No errors in browser console
- [ ] No errors in Render/Vercel logs

---

## 🎯 Quick Reference

### Backend URL (Render)
```
https://e-learning-4-f386.onrender.com
```

### Frontend URL (Vercel)
```
https://your-project-name.vercel.app
```

### Supabase Dashboard
```
https://supabase.com/dashboard/project/hnruyktmlqskqqipjcrc
```

---

## 📞 Need Help?

If deployment fails:
1. Check the **build logs** in Render/Vercel dashboard
2. Look for specific error messages
3. Verify all environment variables are set
4. Make sure Root Directory is correct (`backend` for Render, `frontend` for Vercel)

---

**Good luck with your deployment! 🚀**

