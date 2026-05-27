"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import ReceiptView, { type ReceiptData } from "@/components/ReceiptView";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

export default function ReceiptPage() {
  const params = useParams();
  const receiptNumber = params.receiptNumber as string;
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReceipt() {
      try {
        const num = parseInt(receiptNumber, 10);
        if (isNaN(num)) {
          setError("Invalid receipt number");
          setLoading(false);
          return;
        }

        const { data, error: dbError } = await supabase
          .from("receipts")
          .select("*")
          .eq("receipt_number", num)
          .single();

        if (dbError || !data) {
          setError("Receipt not found");
          setLoading(false);
          return;
        }

        setReceipt({
          receipt_number: data.receipt_number,
          receipt_date: formatDate(data.receipt_date),
          student_name: data.student_name,
          parent_name: data.parent_name,
          program: data.program,
          admission_number: data.admission_number || "",
          enrollment_number: data.enrollment_number || "",
          mobile_number: data.mobile_number,
          month: data.month,
          year: data.year || "2026-27",
          fee_amount: data.fee_amount,
          net_amount: data.net_amount,
          cgst_amount: data.cgst_amount,
          sgst_amount: data.sgst_amount,
          total_amount: data.total_amount,
          paid_amount: data.paid_amount,
          balance_due: data.balance_due,
          pay_mode: data.pay_mode,
          bank_name: data.bank_name || "",
          txn_number: data.txn_number || "",
          txn_date: data.txn_date || "",
          collected_by: data.collected_by,
        });
      } catch (err: any) {
        setError(err?.message || "Failed to load receipt");
      } finally {
        setLoading(false);
      }
    }
    fetchReceipt();
  }, [receiptNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background animate-in fade-in duration-300">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">{error || "Receipt not found"}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 animate-in fade-in duration-500">
      <ReceiptView data={receipt} />
    </div>
  );
}
