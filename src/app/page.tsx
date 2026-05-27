"use client";

import { useState, useRef, useCallback, lazy, Suspense, useEffect } from "react";
import FeeForm, { type FeeFormData } from "@/components/FeeForm";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

// Lazy load ReceiptView for better initial load
const ReceiptView = lazy(() => import("@/components/ReceiptView"));

import type { ReceiptData } from "@/components/ReceiptView";

export default function Home() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [receiptType, setReceiptType] = useState<"new" | "renew">("new");
  const [searchName, setSearchName] = useState("");
  const [searchAdmission, setSearchAdmission] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup debounce on unmount
  const cleanupSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return cleanupSearch;
  }, [cleanupSearch]);

  const handleSearchStudent = async (value: string, type: "name" | "admission") => {
    if (type === "name") {
      setSearchName(value);
      setSearchAdmission(""); // Clear other search
    } else {
      setSearchAdmission(value);
      setSearchName(""); // Clear other search
    }

    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        let query = supabase
          .from("receipts")
          .select(
            "id, student_name, parent_name, program, admission_number, enrollment_number, mobile_number",
          )
          .order("receipt_date", { ascending: false })
          .limit(10);

        if (type === "name") {
          query = query.ilike("student_name", `%${value}%`);
        } else {
          query = query.ilike("admission_number", `%${value}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Get unique students
        const uniqueStudents =
          data?.reduce((acc: any[], current) => {
            const exists = acc.find(
              (item) =>
                item.student_name === current.student_name &&
                item.admission_number === current.admission_number,
            );
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, []) || [];

        setSearchResults(uniqueStudents);
      } catch (err: any) {
        alert(`Failed to search students: ${err?.message || "Unknown error"}`);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setSearchResults([]);
    setSearchName(student.student_name);
    setSearchAdmission(student.admission_number || "");
  };

  const handleSubmit = async (formData: FeeFormData) => {
    setIsLoading(true);
    try {
      const feeAmount = parseFloat(formData.fee_amount) || 0;
      const netAmount = Math.round(feeAmount);
      const cgst = formData.include_gst ? Math.round(netAmount * 0.09) : 0;
      const sgst = formData.include_gst ? Math.round(netAmount * 0.09) : 0;
      const totalAmount = netAmount + cgst + sgst;

      const { data, error } = await supabase
        .from("receipts")
        .insert({
          student_name: formData.student_name,
          parent_name: formData.parent_name,
          program: formData.program,
          admission_number: formData.admission_number || null,
          enrollment_number: formData.enrollment_number || null,
          mobile_number: formData.mobile_number,
          month: formData.month,
          year: formData.year,
          fee_amount: feeAmount,
          net_amount: netAmount,
          cgst_amount: cgst,
          sgst_amount: sgst,
          total_amount: totalAmount,
          paid_amount: totalAmount,
          balance_due: 0,
          pay_mode: formData.pay_mode,
          bank_name: formData.bank_name || null,
          txn_number: formData.txn_number || null,
          txn_date: formData.txn_date || null,
          collected_by: formData.collected_by || "Super Admin",
          receipt_date: formData.receipt_date || undefined,
        })
        .select()
        .single();

      if (error) throw error;

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
      const errorMessage = err?.message || "Unknown error occurred";
      const isNetworkError =
        errorMessage.toLowerCase().includes("failed to fetch") ||
        errorMessage.toLowerCase().includes("network");
      alert(
        isNetworkError
          ? `Database connection failed!\n\nYour Supabase project may be paused (free tier pauses after inactivity).\n\nFix: Go to https://supabase.com/dashboard → find your project → click "Restore Project"\n\nWait 1-2 minutes then try again.`
          : `Failed to create receipt: ${errorMessage}\n\nPlease check your connection and try again.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = useCallback(async () => {
    setIsPdfGenerating(true);
    try {
      const element = document.getElementById("receipt-print");
      if (!element) return;

      // Set fixed dimensions for consistent PDF output
      const originalWidth = element.style.width;
      const originalHeight = element.style.height;
      element.style.width = "1122px";
      element.style.height = "794px";

      // Capture the receipt as canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 1122,
        height: 794,
      });

      // Restore original dimensions
      element.style.width = originalWidth;
      element.style.height = originalHeight;

      const imgData = canvas.toDataURL("image/png");

      // Create PDF in landscape mode
      const pdf = new jsPDF("landscape", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pdfWidth - 2 * margin;
      const availableHeight = pdfHeight - 2 * margin;

      pdf.addImage(imgData, "PNG", margin, margin, availableWidth, availableHeight);
      pdf.save(`Receipt_${receipt?.receipt_number}.pdf`);
    } catch (error: any) {
      const errorMessage = error?.message || "Unknown error occurred";
      alert(`Failed to generate PDF: ${errorMessage}\n\nPlease try again.`);
    } finally {
      setIsPdfGenerating(false);
    }
  }, [receipt]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {!receipt ? (
          <div className="animate-in fade-in duration-500">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Create New Receipt</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Fill in the details below to generate a fee receipt
              </p>
            </div>

            {/* Receipt Type Selection */}
            <div className="mb-4 sm:mb-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-3 p-1 bg-muted rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setReceiptType("new");
                    setSelectedStudent(null);
                    setSearchName("");
                    setSearchAdmission("");
                    setSearchResults([]);
                  }}
                  className={`py-3 px-4 rounded-md font-medium transition-all ${
                    receiptType === "new"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🆕 New Admission
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReceiptType("renew");
                    setSelectedStudent(null);
                    setSearchName("");
                    setSearchAdmission("");
                  }}
                  className={`py-3 px-4 rounded-md font-medium transition-all ${
                    receiptType === "renew"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🔄 Renew
                </button>
              </div>
            </div>

            {/* Student Search for Renew */}
            {receiptType === "renew" && (
              <div className="mb-4 sm:mb-6 max-w-2xl mx-auto space-y-3">
                <div className="relative">
                  <Input
                    placeholder="Search by student name..."
                    value={searchName}
                    onChange={(e) => handleSearchStudent(e.target.value, "name")}
                    className="pr-10"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-xs text-muted-foreground">OR</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                <div className="relative">
                  <Input
                    placeholder="Search by admission number..."
                    value={searchAdmission}
                    onChange={(e) => handleSearchStudent(e.target.value, "admission")}
                    className="pr-10"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="mt-2 bg-card border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => handleSelectStudent(student)}
                        className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0"
                      >
                        <p className="font-medium text-foreground">{student.student_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Parent: {student.parent_name} | Program: {student.program}
                        </p>
                        {student.admission_number && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Admission #: {student.admission_number}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {(searchName.length >= 2 || searchAdmission.length >= 2) &&
                  searchResults.length === 0 &&
                  !isSearching && (
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                      No students found. Try a different name or admission number.
                    </p>
                  )}
              </div>
            )}

            <FeeForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              initialData={selectedStudent}
              isRenew={receiptType === "renew"}
            />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-card p-3 sm:p-4 rounded-lg border shadow-sm">
              <div className="w-full sm:w-auto">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Receipt Generated Successfully
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receipt #{receipt.receipt_number}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isPdfGenerating}
                  className="flex-1 sm:flex-none transition-all hover:scale-105"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isPdfGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                      <span className="hidden sm:inline">Generating...</span>
                    </span>
                  ) : (
                    <span>Download PDF</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setReceipt(null)}
                  className="flex-1 sm:flex-none transition-all hover:scale-105"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">New Receipt</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </div>
            </div>
            <Suspense
              fallback={
                <div className="bg-card p-8 rounded-lg border">
                  <Skeleton className="h-96 w-full" />
                </div>
              }
            >
              <ReceiptView data={receipt} />
            </Suspense>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
