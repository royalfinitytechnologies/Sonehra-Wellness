-- Add deleted_at column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'receipts' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE public.receipts ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add year column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'receipts' AND column_name = 'year'
  ) THEN
    ALTER TABLE public.receipts ADD COLUMN year TEXT;
  END IF;
END $$;

-- Set default year for existing records
UPDATE public.receipts 
SET year = '2026-27' 
WHERE year IS NULL;

-- Create index for faster queries on non-deleted records
CREATE INDEX IF NOT EXISTS idx_receipts_deleted_at 
ON public.receipts(deleted_at) 
WHERE deleted_at IS NULL;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON public.receipts;
DROP POLICY IF EXISTS "Allow public insert" ON public.receipts;
DROP POLICY IF EXISTS "Allow public update" ON public.receipts;
DROP POLICY IF EXISTS "Allow public delete" ON public.receipts;

-- Create comprehensive policies for all operations
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
