-- 1. Create buses table for Shanmuga Bus App
CREATE TABLE IF NOT EXISTS public.buses (
  number INTEGER PRIMARY KEY,
  driver TEXT DEFAULT '',
  contact TEXT DEFAULT '98765 43210',
  route TEXT DEFAULT '',
  photo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies for Public Access (Read & Write)
DROP POLICY IF EXISTS "Public select buses" ON public.buses;
CREATE POLICY "Public select buses" ON public.buses
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert buses" ON public.buses;
CREATE POLICY "Public insert buses" ON public.buses
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update buses" ON public.buses;
CREATE POLICY "Public update buses" ON public.buses
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete buses" ON public.buses;
CREATE POLICY "Public delete buses" ON public.buses
  FOR DELETE USING (true);
