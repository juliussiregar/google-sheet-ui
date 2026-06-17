import type { ChartConfig } from "@/lib/types";
import { ChartRenderer } from "./ChartRenderer";
import { Sparkles } from "lucide-react";

interface HeroChartProps {
  chart: ChartConfig | undefined;
}

export function HeroChart({ chart }: HeroChartProps) {
  if (!chart) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-slate-900/50 to-violet-500/10 p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-400" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-indigo-300/80">
            Grafik Utama
          </p>
          <h3 className="text-lg font-semibold text-white">{chart.title}</h3>
        </div>
      </div>

      <ChartRenderer chart={chart} large />
    </div>
  );
}
