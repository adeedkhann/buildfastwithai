-- JanMitra citizen accounts
-- Apply this migration in Supabase SQL Editor or with Supabase CLI.
-- The name/mobile/password columns are retained for compatibility with src/lib/auth.ts.

CREATE TABLE IF NOT EXISTS public.citizens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  mobile TEXT,
  password TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT citizens_email_key UNIQUE (email),
  CONSTRAINT citizens_phone_key UNIQUE (phone),
  CONSTRAINT citizens_mobile_key UNIQUE (mobile)
);

ALTER TABLE public.citizens
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS mobile TEXT,
  ADD COLUMN IF NOT EXISTS password TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now());

UPDATE public.citizens
SET full_name = COALESCE(full_name, name),
    phone = COALESCE(phone, mobile)
WHERE full_name IS NULL OR phone IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS citizens_email_unique_idx ON public.citizens (email);
CREATE UNIQUE INDEX IF NOT EXISTS citizens_phone_unique_idx ON public.citizens (phone) WHERE phone IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS citizens_mobile_unique_idx ON public.citizens (mobile) WHERE mobile IS NOT NULL;

ALTER TABLE public.citizens ENABLE ROW LEVEL SECURITY;

-- Compatibility policies for the current custom client-side authentication flow.
-- Replace these with Supabase Auth user-scoped policies before production use.
DROP POLICY IF EXISTS "citizens_public_select" ON public.citizens;
DROP POLICY IF EXISTS "citizens_public_insert" ON public.citizens;
DROP POLICY IF EXISTS "citizens_public_update" ON public.citizens;

CREATE POLICY "citizens_public_select"
  ON public.citizens FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "citizens_public_insert"
  ON public.citizens FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "citizens_public_update"
  ON public.citizens FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_citizens_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS citizens_set_updated_at ON public.citizens;
CREATE TRIGGER citizens_set_updated_at
  BEFORE UPDATE ON public.citizens
  FOR EACH ROW
  EXECUTE FUNCTION public.set_citizens_updated_at();

NOTIFY pgrst, 'reload schema';
