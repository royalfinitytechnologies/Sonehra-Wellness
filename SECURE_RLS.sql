-- ========================================================
-- SECURE YOUR DATABASE: ONLY AUTHENTICATED TEACHERS
-- ========================================================

-- 1. Enable RLS on the receipts table (if not already enabled)
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing public policies
DROP POLICY IF EXISTS "Allow public read" ON public.receipts;
DROP POLICY IF EXISTS "Allow public insert" ON public.receipts;
DROP POLICY IF EXISTS "Allow public update" ON public.receipts;
DROP POLICY IF EXISTS "Allow public delete" ON public.receipts;

-- 3. Create SECURE policies (Authenticated users only)

-- Teachers can view all receipts
CREATE POLICY "Authenticated users can view receipts" 
ON public.receipts 
FOR SELECT 
TO authenticated 
USING (true);

-- Teachers can create new receipts
CREATE POLICY "Authenticated users can insert receipts" 
ON public.receipts 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Teachers can update receipts (e.g., mark as deleted or fix errors)
CREATE POLICY "Authenticated users can update receipts" 
ON public.receipts 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Teachers can delete receipts (if needed)
CREATE POLICY "Authenticated users can delete receipts" 
ON public.receipts 
FOR DELETE 
TO authenticated 
USING (true);

-- Done! Your data is now secured.
-- Only teachers who are logged in via your portal can access this data.
