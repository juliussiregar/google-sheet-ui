import type { ColumnMeta, ColumnType } from "@/lib/types";
import { Hash, Type, Calendar, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

const TYPE_CONFIG: Record<
  ColumnType,
  { icon: typeof Hash; label: string; color: string }
> = {
  number: { icon: Hash, label: "Numerik", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  category: { icon: Tags, label: "Kategori", color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
  text: { icon: Type, label: "Teks", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  date: { icon: Calendar, label: "Tanggal", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
};

interface ColumnInsightsProps {
  columns: ColumnMeta[];
}

export function ColumnInsights({ columns }: ColumnInsightsProps) {
  return (
    <div>
      <SectionHeader
        title="Profil Kolom"
        description="Deteksi otomatis tipe data dan kelengkapan tiap kolom"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {columns.map((col, i) => {
          const config = TYPE_CONFIG[col.type];
          const Icon = config.icon;
          return (
            <article
              key={col.key}
              className={cn(
                "glass-card animate-fade-in-up rounded-2xl p-4 transition-all hover:border-white/15 hover:shadow-lg",
                `stagger-${Math.min(i + 1, 6)}`
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">{col.label}</h3>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-500">{col.key}</p>
                </div>
                <span
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-medium",
                    config.color
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {config.label}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Unik</p>
                  <p className="text-lg font-bold text-white">{col.uniqueCount}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Fill Rate</p>
                  <p className="text-lg font-bold text-white">{col.fillRate}%</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      col.fillRate >= 80
                        ? "bg-emerald-500"
                        : col.fillRate >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                    )}
                    style={{ width: `${col.fillRate}%` }}
                  />
                </div>
              </div>

              {col.sampleValues.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {col.sampleValues.slice(0, 3).map((v) => (
                    <span
                      key={v}
                      className="max-w-full truncate rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-slate-400"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
