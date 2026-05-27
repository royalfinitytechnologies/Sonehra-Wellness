import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  // If it's already in DD/MM/YYYY format, return it
  if (dateStr.includes("/")) return dateStr;

  // Try to parse YYYY-MM-DD or ISO date string timezone-safely
  const cleanDate = dateStr.split("T")[0];
  const parts = cleanDate.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  // Fallback
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    // Ignore error
  }
  return dateStr;
}
