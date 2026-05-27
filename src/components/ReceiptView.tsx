import { QRCodeSVG } from "qrcode.react";
import { numberToWords } from "@/lib/number-to-words";

export interface ReceiptData {
  receipt_number: number;
  receipt_date: string;
  student_name: string;
  parent_name: string;
  program: string;
  admission_number: string;
  enrollment_number: string;
  mobile_number: string;
  month: string;
  year: string;
  fee_amount: number;
  net_amount: number;
  cgst_amount: number;
  sgst_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  pay_mode: string;
  bank_name: string;
  txn_number: string;
  txn_date: string;
  collected_by: string;
}

function SingleReceipt({ data, copyType }: { data: ReceiptData; copyType: string }) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const qrValue = `${baseUrl}/receipt/${data.receipt_number}`;

  return (
    <div className="receipt-container border-2 border-black p-3 text-[11px] leading-tight h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center pb-2 mb-1 border-b border-black">
        <div className="w-[100px] h-[70px] flex items-center justify-center mr-3 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Logo"
            className="max-h-[70px] max-w-[100px] object-contain"
            crossOrigin="anonymous"
          />
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-[16px] font-bold tracking-wide leading-tight">SONEHRA WELLNESS</h2>
          <p className="text-[10px] leading-tight">PLOT NO.14, SECTOR 15, FARIDABAD, HARYANA</p>
          <p className="text-[10px] leading-tight">GST : 06APXPK5623B3ZS</p>
          <p className="text-[10px] leading-tight">Phone No. - 9220809902</p>
        </div>
        <div className="w-[100px] shrink-0"></div>
      </div>

      {/* Title */}
      <div className="receipt-title-bg text-center font-bold text-[13px] py-1 mb-1">
        Fee Receipt - {data.year} ({copyType})
      </div>

      {/* Student Details Table */}
      <table className="w-full border-collapse text-[11px] mb-1">
        <tbody>
          <tr>
            <td className="border border-black p-[4px] font-semibold">
              Receipt No. : {data.receipt_number}
            </td>
            <td className="border border-black p-[4px] font-semibold">
              Receipt Date : {data.receipt_date}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]" colSpan={2}>
              Name : <strong>{data.student_name}</strong>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]" colSpan={2}>
              Parent Name : <strong>{data.parent_name}</strong>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]" colSpan={2}>
              Program : <strong>{data.program}</strong>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]">Admission No. : {data.admission_number}</td>
            <td className="border border-black p-[4px]">
              ENROLLMENT NO. : {data.enrollment_number}
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]">
              Month : <strong>{data.month}</strong>
            </td>
            <td className="border border-black p-[4px]">
              Year : <strong>{data.year}</strong>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]" colSpan={2}>
              Mob No. : <strong>{data.mobile_number}</strong>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]">
              Pay Mode : <strong>{data.pay_mode}</strong>
            </td>
            <td className="border border-black p-[4px]">Bank Name : {data.bank_name || ""}</td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]">Txn No. : {data.txn_number || "0"}</td>
            <td className="border border-black p-[4px]">Txn Date : {data.txn_date || ""}</td>
          </tr>
          <tr>
            <td className="border border-black p-[4px]" colSpan={2}>
              Collected By : <strong>{data.collected_by}</strong>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Fee Breakdown */}
      <table className="w-full border-collapse text-[11px] flex-1">
        <thead>
          <tr className="receipt-fee-header-bg">
            <th className="border border-black p-[4px] text-left font-bold">Fee Type</th>
            <th className="border border-black p-[4px] text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-[4px]">Course Fee ({data.month})</td>
            <td className="border border-black p-[4px] text-right">
              Rs. {data.fee_amount.toFixed(2)}/-
            </td>
          </tr>
          <tr className="font-bold">
            <td className="border border-black p-[4px]">Total Amount to Pay</td>
            <td className="border border-black p-[4px] text-right">
              Rs. {data.fee_amount.toFixed(0)}/-
            </td>
          </tr>
          <tr className="font-bold">
            <td className="border border-black p-[4px]">Net Amount</td>
            <td className="border border-black p-[4px] text-right">
              Rs. {data.net_amount.toFixed(0)}/-
            </td>
          </tr>
          {data.cgst_amount > 0 && (
            <tr className="font-bold">
              <td className="border border-black p-[4px]">CGST (9 %)</td>
              <td className="border border-black p-[4px] text-right">
                Rs. {data.cgst_amount.toFixed(0)}/-
              </td>
            </tr>
          )}
          {data.sgst_amount > 0 && (
            <tr className="font-bold">
              <td className="border border-black p-[4px]">SGST (9 %)</td>
              <td className="border border-black p-[4px] text-right">
                Rs. {data.sgst_amount.toFixed(0)}/-
              </td>
            </tr>
          )}
          <tr className="receipt-paid-bg font-bold">
            <td className="border border-black p-[4px]">Paid</td>
            <td className="border border-black p-[4px] text-right">
              Rs. {data.paid_amount.toFixed(0)}/-
              <br />
              <span className="text-[9px] font-normal">({numberToWords(data.paid_amount)})</span>
            </td>
          </tr>
          <tr className="font-bold">
            <td className="border border-black p-[4px]">Balance Due</td>
            <td className="border border-black p-[4px] text-right">
              Rs. {data.balance_due.toFixed(0)}/-
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer: QR + Signature */}
      <div className="flex items-end justify-between mt-2 pt-2 border-t border-black">
        <div>
          <QRCodeSVG value={qrValue} size={60} />
        </div>
        <div className="text-center">
          <div className="w-32 border-t border-black mt-6 pt-1 text-[10px]">Auth. Signature</div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptView({ data }: { data: ReceiptData }) {
  return (
    <div id="receipt-print" className="bg-white p-0 w-full h-full flex items-center justify-center">
      <div className="flex gap-3 w-full h-full p-3">
        <div className="flex-1">
          <SingleReceipt data={data} copyType="Office Copy" />
        </div>
        <div className="flex-1">
          <SingleReceipt data={data} copyType="Student Copy" />
        </div>
      </div>
    </div>
  );
}
