"use client";

import { X, Filter } from "lucide-react";
import type { ColumnMeta } from "@/lib/types";
import type { Filters } from "@/lib/filters";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  columns: ColumnMeta[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  rows: Record<string, string>[];
  totalRows: number;
}

export function FilterBar({ columns, filters, onChange, rows, totalRows }: FilterBarProps) {
  const activeCount = Object.values(filters).filter(Boolean).length;
  const filteredCount = (() => {
    const active = Object.entries(filters).filter(([, v]) => v);
    if (active.length === 0) return rows.length;
    return rows.filter((row) =>
      active.every(([key, value]) => row[key]?.trim() === value)
    ).length;
  })();

  const clearAll = () => onChange({});

  const getOptions = (key: string) => {
    const values = new Set<string>();
    for (const row of rows) {
      const v = row[key]?.trim();
      if (v) values.add(v);
    }
    return [...values].sort();
  };

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-indigo-400" />
          <span className="text-sm font-medium text-white">Filter Data</span>
          {activeCount > 0 && (
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
              {activeCount} aktif
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {filteredCount} / {totalRows} baris
          </span>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-white"
            >
              <X className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {columns.slice(0, 5).map((col) => (
          <select
            key={col.key}
            value={filters[col.key] ?? ""}
            onChange={(e) =>
              onChange({ ...filters, [col.key]: e.target.value || "" })
            }
            className={cn(
              "rounded-xl border bg-slate-900/60 px-3 py-2 text-xs text-slate-300 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
              filters[col.key]
                ? "border-indigo-500/40 text-indigo-200"
                : "border-white/10"
            )}
          >
            <option value="">{col.label}: Semua</option>
            {getOptions(col.key).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
