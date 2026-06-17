"use client";

import { useEffect, useState } from "react";
import { Link2, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkInputProps {
  onSubmit: (url: string) => void;
  loading?: boolean;
  initialUrl?: string;
  compact?: boolean;
}

const EXAMPLE_URL =
  "https://docs.google.com/spreadsheets/d/147gb63OkHk3U9avUWTDqXA0K5K4TpjJS9uGxb5HMMGs/edit?gid=0#gid=0";

export function LinkInput({ onSubmit, loading, initialUrl = "", compact }: LinkInputProps) {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !loading) onSubmit(url.trim());
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex w-full min-w-0 items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-1.5">
          <Link2 className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ganti link sheet..."
            className="w-full min-w-0 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={!url.trim() || loading}
          className="shrink-0 rounded-xl bg-indigo-500/20 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/30 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Load"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="relative">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 opacity-30 blur-lg" />
        <div className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-2 backdrop-blur-xl sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 px-3">
            <Link2 className="h-5 w-5 shrink-0 text-indigo-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste link Google Sheet di sini..."
              className="w-full bg-transparent py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={!url.trim() || loading}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-violet-500 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memuat...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Buat Dashboard
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setUrl(EXAMPLE_URL)}
        className="mt-3 text-xs text-slate-500 transition-colors hover:text-indigo-400"
      >
        Gunakan contoh sheet VVIP 2026 →
      </button>
    </form>
  );
}
