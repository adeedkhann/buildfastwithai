ALTER TABLE public.complaints
  ADD COLUMN IF NOT EXISTS original_text TEXT,
  ADD COLUMN IF NOT EXISTS translated_text TEXT;

UPDATE public.complaints
SET original_text = COALESCE(original_text, description),
    translated_text = COALESCE(translated_text, description_hi, description)
WHERE original_text IS NULL OR translated_text IS NULL;