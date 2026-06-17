import type { InsightItem } from "@/lib/types";
import { AlertTriangle, CheckCircle2, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  highlight: Sparkles,
};

const STYLES = {
  info: "border-cyan-500/20 bg-cyan-500/5",
  success: "border-emerald-500/20 bg-emerald-500/5",
  warning: "border-amber-500/20 bg-amber-500/5",
  highlight: "border-indigo-500/20 bg-indigo-500/5",
};

const ICON_COLORS = {
  info: "text-cyan-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  highlight: "text-indigo-400",
};

interface InsightsPanelProps {
  insights: InsightItem[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div>
      <SectionHeader
        title="Insight Otomatis"
        description="Ringkasan analisis yang digenerate dari pola data"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {insights.map((insight, i) => {
          const Icon = ICONS[insight.type];
          return (
            <article
              key={insight.id}
              className={cn(
                "animate-fade-in-up rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                STYLES[insight.type],
                `stagger-${Math.min(i + 1, 6)}`
              )}
            >
              <div className="flex gap-4">
                <div className={cn("mt-0.5 shrink-0", ICON_COLORS[insight.type])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white">{insight.title}</h3>
                    {insight.metric && (
                      <span className="shrink-0 rounded-lg bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                        {insight.metric}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {insight.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
