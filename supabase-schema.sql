-- =========================================
-- Dump Zone — Supabase Schema
-- Run this in your Supabase SQL editor
-- =========================================

-- TABLE: items
CREATE TABLE IF NOT EXISTS public.items (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content     text         NOT NULL,
  status      text         NOT NULL DEFAULT 'inbox' CHECK (status IN ('inbox', 'done', 'incinerated')),
  created_at  timestamptz  NOT NULL DEFAULT now(),
  xp_value    integer      NOT NULL DEFAULT 10
);

-- TABLE: user_stats
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id           uuid    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_xp        bigint  NOT NULL DEFAULT 0,
  current_level     integer NOT NULL DEFAULT 1,
  streak_count      integer NOT NULL DEFAULT 0,
  last_active_date  date
);

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Items: users see/edit only their own
CREATE POLICY "items_select" ON public.items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "items_insert" ON public.items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "items_update" ON public.items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "items_delete" ON public.items
  FOR DELETE USING (auth.uid() = user_id);

-- User stats: users see/edit only their own
CREATE POLICY "stats_select" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "stats_insert" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "stats_update" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- =========================================
-- INDEXES
-- =========================================
CREATE INDEX IF NOT EXISTS items_user_id_status_idx
  ON public.items(user_id, status);

CREATE INDEX IF NOT EXISTS items_created_at_idx
  ON public.items(created_at DESC);
