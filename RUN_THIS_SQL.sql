-- ============================================
-- COPY AND PASTE THIS ENTIRE SQL IN SUPABASE
-- ============================================

-- Step 1: Add deleted_at column
ALTER TABLE public.receipts 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Step 2: Add year column
ALTER TABLE public.receipts 
ADD COLUMN IF NOT EXISTS year TEXT;

-- Step 3: Set default year for existing records
UPDATE public.receipts 
SET year = '2026-27' 
WHERE year IS NULL;

-- Step 4: Create index for performance
CREATE INDEX IF NOT EXISTS idx_receipts_deleted_at 
ON public.receipts(deleted_at) 
WHERE deleted_at IS NULL;

-- Step 5: Drop old policies
DROP POLICY IF EXISTS "Allow public read" ON public.receipts;
DROP POLICY IF EXISTS "Allow public insert" ON public.receipts;
DROP POLICY IF EXISTS "Allow public update" ON public.receipts;
DROP POLICY IF EXISTS "Allow public delete" ON public.receipts;

-- Step 6: Create new policies with UPDATE and DELETE permissions
CREATE POLICY "Allow public read" 
ON public.receipts 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert" 
ON public.receipts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update" 
ON public.receipts 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public delete" 
ON public.receipts 
FOR DELETE 
USING (true);

-- Done! Now delete functionality will work.
