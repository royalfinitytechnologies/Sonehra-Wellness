"use client";

import { useState, useEffect } from "react";
import DashboardStats from "@/components/DashboardStats";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("receipt_number", { ascending: false });

      if (error) throw error;
      if (data) setReceipts(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load receipts. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Overview of all fee receipts and transactions
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 sm:h-8 w-24 sm:w-32" />
              <Skeleton className="h-8 sm:h-10 w-32 sm:w-40" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 sm:h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 sm:h-96 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12 animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-destructive/10 mb-3 sm:mb-4">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
            </div>
            <p className="text-destructive mb-3 sm:mb-4 font-medium text-sm sm:text-base px-4">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm sm:text-base bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all hover:scale-105"
            >
              Refresh Page
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <DashboardStats receipts={receipts} onUpdate={fetchReceipts} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
