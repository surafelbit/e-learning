# Vercel Deployment Fix for Native Binding Error

## The Problem
Nuxt 4 requires native bindings from `@oxc-parser/binding-linux-x64-gnu`, but Vercel uses `npm install --ignore-scripts` which prevents optional dependencies from installing correctly.

## Solution Applied

1. **Added prebuild script** - Installs the binding before build runs
2. **Added to optionalDependencies** - Ensures npm tries to install it
3. **Updated vercel.json** - Build command installs binding first

## If This Still Doesn't Work

### Option 1: Configure in Vercel Dashboard
1. Go to your Vercel project settings
2. Navigate to "Settings" → "General"
3. Set **Build Command** to:
   ```
   npm install --include=optional @oxc-parser/binding-linux-x64-gnu --no-save && npm run build
   ```
4. Set **Install Command** to:
   ```
   npm install --include=optional
   ```

### Option 2: Downgrade to Nuxt 3
If the native binding issue persists, consider downgrading to Nuxt 3 which doesn't have this issue:

```bash
cd frontend
npm install nuxt@^3.13.0
```

### Option 3: Use Netlify Instead
Netlify handles Nuxt 4 deployments better:
- Go to [netlify.com](https://netlify.com)
- Import your repository
- Set build command: `npm run build`
- Set publish directory: `.output/public`

## Current Configuration

The following files have been updated:
- `frontend/package.json` - Added prebuild script and optionalDependencies
- `frontend/vercel.json` - Updated build command

Try deploying again. If it still fails, use Option 1 to configure directly in Vercel dashboard.


