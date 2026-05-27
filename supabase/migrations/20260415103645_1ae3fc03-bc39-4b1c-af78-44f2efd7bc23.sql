
-- Create receipts table
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number SERIAL,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  program TEXT NOT NULL,
  admission_number TEXT,
  enrollment_number TEXT,
  mobile_number TEXT NOT NULL,
  month TEXT NOT NULL,
  fee_amount NUMERIC(10,2) NOT NULL,
  net_amount NUMERIC(10,2) NOT NULL,
  cgst_amount NUMERIC(10,2) NOT NULL,
  sgst_amount NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  paid_amount NUMERIC(10,2) NOT NULL,
  balance_due NUMERIC(10,2) NOT NULL DEFAULT 0,
  pay_mode TEXT NOT NULL DEFAULT 'Cash',
  bank_name TEXT,
  txn_number TEXT,
  txn_date TEXT,
  collected_by TEXT NOT NULL DEFAULT 'Super Admin',
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (no auth required for this app)
CREATE POLICY "Allow public read" ON public.receipts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.receipts FOR INSERT WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_receipts_updated_at
BEFORE UPDATE ON public.receipts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
