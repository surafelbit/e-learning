# BrainBite - AI E-Learning MVP

BrainBite is a lightweight e-learning platform that allows users to generate courses instantly using AI.

## Tech Stack

- **Frontend**: Nuxt 3, Tailwind CSS, Supabase Auth.
- **Backend**: NestJS, OpenAI SDK, Supabase Client.
- **Database**: Supabase (PostgreSQL).
- **AI**: OpenAI GPT-3.5/4.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Supabase Project
- OpenAI API Key

### 1. Database Setup (Supabase)
1. Go to your Supabase Dashboard.
2. Run the SQL script found in `supabase_schema.sql` in the SQL Editor.
3. Keep your Supabase URL, Anon Key, and Service Role Key handy.

### 2. Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `npm install`.
3. Create `.env` file (see `.env.example` or below):
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   AI_API_KEY=sk-your-openai-key
   PORT=3000
   ```
4. Run locally: `npm run start:dev`.

### 3. Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Create `.env` file:
   ```env
   NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NUXT_PUBLIC_BACKEND_URL=http://localhost:3000
   ```
4. Run locally: `npm run dev`.

## Deployment

### Frontend (Vercel/Netlify)
1. Import the repository.
2. Set Root Directory to `frontend`.
3. Set Build Command: `npm run build` / `nuxt build`.
4. Set Output Directory: `.output/public` or `.output` (Nitro preset).
5. Add Environment Variables from Step 3.

### Backend (Render/Railway/Fly.io)
1. Import the repository.
2. Set Root Directory to `backend`.
3. Set Build Command: `npm run build`.
4. Set Start Command: `npm run start:prod`.
5. Add Environment Variables from Step 2.
6. **Important**: Update Frontend `NUXT_PUBLIC_BACKEND_URL` to point to the deployed Backend URL.

## Features
- **Authentication**: Usage of Supabase Auth.
- **Course Generation**: Enter a subject, get a 4-chapter course with a quiz.
- **Course Player**: Read content (Markdown) and take MCQs.
- **TTS**: Listen to chapter content.
