-- Add deleted_at column for soft delete functionality
ALTER TABLE public.receipts 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries on non-deleted records
CREATE INDEX idx_receipts_deleted_at ON public.receipts(deleted_at) WHERE deleted_at IS NULL;
