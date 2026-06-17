import type { DistributionItem } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { SectionHeader } from "./SectionHeader";

interface StatusDistributionProps {
  items: DistributionItem[];
  title?: string;
}

export function StatusDistribution({ items, title = "Distribusi Status" }: StatusDistributionProps) {
  if (items.length === 0) return null;

  return (
    <div className="glass-card animate-fade-in-up rounded-2xl p-5">
      <SectionHeader
        title={title}
        description="Proporsi data berdasarkan kategori utama"
      />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="group">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{item.label}</span>
              <span className="text-slate-400">
                {formatNumber(item.value)}{" "}
                <span className="text-slate-500">({item.percentage.toFixed(1)}%)</span>
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-90"
                style={{
                  width: `${Math.max(item.percentage, 2)}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 12px ${item.color}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
