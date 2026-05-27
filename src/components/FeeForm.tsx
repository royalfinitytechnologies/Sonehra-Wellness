import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface FeeFormData {
  student_name: string;
  parent_name: string;
  program: string;
  admission_number: string;
  enrollment_number: string;
  mobile_number: string;
  month: string;
  year: string;
  fee_amount: string;
  pay_mode: string;
  bank_name: string;
  txn_number: string;
  txn_date: string;
  collected_by: string;
  receipt_date: string;
  include_gst: boolean;
}

const getLocalDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MONTHS = ["1 Month", "3 Months", "Other"];

const YEARS = ["2024-25", "2025-26", "2026-27", "2027-28", "2028-29"];

const PROGRAMS = [
  "Filial Love",
  "Hacer Morning",
  "Hacer Evening",
  "Walk-in Daycare",
  "Gravida Bambino",
  "Other",
];

export default function FeeForm({
  onSubmit,
  isLoading,
  initialData,
  isRenew = false,
}: {
  onSubmit: (data: FeeFormData) => void;
  isLoading: boolean;
  initialData?: any;
  isRenew?: boolean;
}) {
  const [form, setForm] = useState<FeeFormData>({
    student_name: initialData?.student_name || "",
    parent_name: initialData?.parent_name || "",
    program: initialData?.program || "",
    admission_number: initialData?.admission_number || "",
    enrollment_number: initialData?.enrollment_number || "",
    mobile_number: initialData?.mobile_number || "",
    month: "",
    year: "2026-27",
    fee_amount: "",
    pay_mode: "Online",
    bank_name: "",
    txn_number: "",
    txn_date: "",
    collected_by: "Super Admin",
    receipt_date: getLocalDateString(),
    include_gst: true,
  });

  const [customMonth, setCustomMonth] = useState("");
  const [customProgram, setCustomProgram] = useState("");

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        student_name: initialData.student_name || "",
        parent_name: initialData.parent_name || "",
        program: initialData.program || "",
        admission_number: initialData.admission_number || "",
        enrollment_number: initialData.enrollment_number || "",
        mobile_number: initialData.mobile_number || "",
      }));
    }
  }, [initialData]);

  const handleChange = (field: keyof FeeFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Reset custom values when changing selections
    if (field === "month" && value !== "Other") {
      setCustomMonth("");
    }
    if (field === "program" && value !== "Other") {
      setCustomProgram("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If "Other" is selected, use custom values
    const finalForm = {
      ...form,
      month: form.month === "Other" ? customMonth : form.month,
      program: form.program === "Other" ? customProgram : form.program,
    };
    onSubmit(finalForm);
  };

  const feeNum = parseFloat(form.fee_amount) || 0;
  const netAmount = Math.round(feeNum);
  const cgst = form.include_gst ? Math.round(netAmount * 0.09) : 0;
  const sgst = form.include_gst ? Math.round(netAmount * 0.09) : 0;
  const total = netAmount + cgst + sgst;

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-xl bg-card/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-center">
          {isRenew ? "🔄 Renew Fee Receipt" : "🆕 New Fee Receipt"}
        </CardTitle>
        {isRenew && initialData && (
          <p className="text-sm text-center text-muted-foreground">
            Renewing for: <strong>{initialData.student_name}</strong>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 group">
            <Label className="group-focus-within:text-primary transition-colors">
              Student Name *
            </Label>
            <Input
              required
              value={form.student_name}
              onChange={(e) => handleChange("student_name", e.target.value)}
              disabled={isRenew && !!initialData}
              className={`smooth-transition focus:ring-2 focus:ring-primary/20 ${isRenew && initialData ? "bg-muted" : "bg-background/50"}`}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Parent Name *</Label>
            <Input
              required
              value={form.parent_name}
              onChange={(e) => handleChange("parent_name", e.target.value)}
              disabled={isRenew && !!initialData}
              className={isRenew && initialData ? "bg-muted" : ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Program *</Label>
            <Select
              value={form.program}
              onValueChange={(v) => handleChange("program", v)}
              disabled={isRenew && !!initialData}
            >
              <SelectTrigger className={isRenew && initialData ? "bg-muted" : ""}>
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.program === "Other" && (
            <div className="space-y-1.5">
              <Label>Custom Program *</Label>
              <Input
                required
                value={customProgram}
                onChange={(e) => setCustomProgram(e.target.value)}
                placeholder="Enter custom program"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Admission Number</Label>
            <Input
              value={form.admission_number}
              onChange={(e) => handleChange("admission_number", e.target.value)}
              disabled={isRenew && !!initialData}
              className={isRenew && initialData ? "bg-muted" : ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Enrollment Number</Label>
            <Input
              value={form.enrollment_number}
              onChange={(e) => handleChange("enrollment_number", e.target.value)}
              disabled={isRenew && !!initialData}
              className={isRenew && initialData ? "bg-muted" : ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Mobile Number *</Label>
            <Input
              required
              value={form.mobile_number}
              onChange={(e) => handleChange("mobile_number", e.target.value)}
              disabled={isRenew && !!initialData}
              className={isRenew && initialData ? "bg-muted" : ""}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Month *</Label>
            <Select value={form.month} onValueChange={(v) => handleChange("month", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.month === "Other" && (
            <div className="space-y-1.5">
              <Label>Custom Month *</Label>
              <Input
                required
                value={customMonth}
                onChange={(e) => setCustomMonth(e.target.value)}
                placeholder="Enter custom month"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Year *</Label>
            <Select value={form.year} onValueChange={(v) => handleChange("year", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Receipt Date *</Label>
            <Input
              required
              type="date"
              value={form.receipt_date}
              onChange={(e) => handleChange("receipt_date", e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Transaction Date</Label>
            <Input
              type="date"
              value={form.txn_date}
              onChange={(e) => handleChange("txn_date", e.target.value)}
              className="bg-background/50"
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fee Amount (Base Amount) *</Label>
            <Input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.fee_amount}
              onChange={(e) => handleChange("fee_amount", e.target.value)}
              placeholder="Enter base amount"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Pay Mode</Label>
            <Select value={form.pay_mode} onValueChange={(v) => handleChange("pay_mode", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Collected By</Label>
            <Input
              value={form.collected_by}
              onChange={(e) => handleChange("collected_by", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Bank Name</Label>
            <Input
              value={form.bank_name}
              onChange={(e) => handleChange("bank_name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Transaction Number</Label>
            <Input
              value={form.txn_number}
              onChange={(e) => handleChange("txn_number", e.target.value)}
            />
          </div>

          {/* GST Toggle Section */}
          <div className="col-span-full bg-muted/50 rounded-lg p-4 border-2 border-dashed border-muted-foreground/20">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="include_gst"
                checked={form.include_gst}
                onChange={(e) => handleChange("include_gst", e.target.checked)}
                className="h-5 w-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer accent-primary"
                aria-label="Include GST in receipt"
              />
              <div className="flex-1">
                <Label
                  htmlFor="include_gst"
                  className="text-base font-semibold cursor-pointer select-none flex items-center gap-2"
                >
                  Include GST (18%) for this receipt
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${form.include_gst ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    {form.include_gst ? "GST Enabled" : "No GST"}
                  </span>
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {form.include_gst
                    ? "CGST (9%) and SGST (9%) will be added to the base amount"
                    : "Only base amount will be charged without any GST"}
                </p>
              </div>
            </div>
          </div>

          {/* GST Preview */}
          {feeNum > 0 && (
            <div className="col-span-full bg-muted rounded-lg p-3 text-sm space-y-1 animate-in fade-in">
              <p className="flex justify-between">
                <span>Base Amount:</span> <strong>₹{netAmount}</strong>
              </p>
              {form.include_gst ? (
                <>
                  <p className="flex justify-between">
                    <span>CGST (9%):</span> <strong>₹{cgst}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>SGST (9%):</span> <strong>₹{sgst}</strong>
                  </p>
                  <p className="flex justify-between border-t pt-1 mt-1">
                    <span>Total Amount (with GST):</span>{" "}
                    <strong className="text-primary text-lg">₹{total}</strong>
                  </p>
                </>
              ) : (
                <p className="flex justify-between border-t pt-1 mt-1">
                  <span>Total Amount (No GST):</span>{" "}
                  <strong className="text-primary text-lg">₹{total}</strong>
                </p>
              )}
            </div>
          )}

          <div className="col-span-full pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></span>
                  Generating Receipt...
                </span>
              ) : (
                "Generate Receipt"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
