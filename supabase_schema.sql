-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- COURSES TABLE
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subject text not null,
  description text,
  created_by uuid references auth.users(id) not null,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COURSE PAGES TABLE
create table public.course_pages (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade not null,
  page_index int not null,
  title text not null,
  content_md text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUESTIONS TABLE
create table public.questions (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade not null,
  question_text text not null,
  type text default 'mcq',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- QUESTION OPTIONS TABLE
create table public.question_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid references public.questions(id) on delete cascade not null,
  option_text text not null,
  is_correct boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ATTEMPTS TABLE (Optional but good for completeness)
create table public.attempts (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  score int,
  answers_json jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.courses enable row level security;
alter table public.course_pages enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.attempts enable row level security;

-- Courses: Everyone can view published, Creators can view their own
create policy "Public courses are viewable by everyone"
  on public.courses for select
  using ( is_published = true );

create policy "Users can see their own unpublished courses"
  on public.courses for select
  using ( auth.uid() = created_by );

create policy "Users can insert their own courses"
  on public.courses for insert
  with check ( auth.uid() = created_by );

create policy "Users can update their own courses"
  on public.courses for update
  using ( auth.uid() = created_by );

-- Pages: Viewable if course is viewable (This is a simplification, ideally based on course visibility)
-- A cleaner way is to rely on the parent course. For MVP, we'll allow read for all authenticated for now ??
-- Actually, strict RLS:

create policy "Pages viewable if course is published or user is creator"
  on public.course_pages for select
  using (
    exists (
      select 1 from public.courses
      where id = public.course_pages.course_id
      and (is_published = true or created_by = auth.uid())
    )
  );

create policy "Creators can insert pages"
  on public.course_pages for insert
  with check (
    exists (
      select 1 from public.courses
      where id = course_id
      and created_by = auth.uid()
    )
  );

-- Questions & Options: Similar logic
create policy "Questions viewable if course is viewable"
  on public.questions for select
  using (
    exists (
      select 1 from public.courses
      where id = public.questions.course_id
      and (is_published = true or created_by = auth.uid())
    )
  );

create policy "Options viewable if course is viewable"
  on public.question_options for select
  using (
    exists (
      select 1 from public.questions q
      join public.courses c on c.id = q.course_id
      where q.id = public.question_options.question_id
      and (c.is_published = true or c.created_by = auth.uid())
    )
  );
