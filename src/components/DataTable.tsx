"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import type { ColumnMeta } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DataTableProps {
  rows: Record<string, string>[];
  columns: ColumnMeta[];
}

const PAGE_SIZE = 12;

function statusBadge(value: string): string {
  const s = value.toLowerCase();
  if (s.includes("akad")) return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20";
  if (s.includes("cancel") || s.includes("batal")) return "bg-red-500/15 text-red-300 ring-red-500/20";
  if (s.includes("progress")) return "bg-amber-500/15 text-amber-300 ring-amber-500/20";
  if (s.includes("sp3k")) return "bg-indigo-500/15 text-indigo-300 ring-indigo-500/20";
  if (s.includes("belum")) return "bg-orange-500/15 text-orange-300 ring-orange-500/20";
  if (s === "ya") return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20";
  if (s === "tidak") return "bg-slate-500/15 text-slate-400 ring-slate-500/20";
  return "";
}

function isBadgeColumn(key: string): boolean {
  return /status|prioritas|priority/i.test(key);
}

export function DataTable({ rows, columns }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const displayColumns = columns.filter((c) => c.key.trim()).slice(0, 9);

  const filtered = useMemo(() => {
    let result = rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) => v.toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        const cmp = av.localeCompare(bv, "id", { numeric: true });
        return sortAsc ? cmp : -cmp;
      });
    }
    return result;
  }, [rows, search, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE
  );

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
    setPage(0);
  };

  const exportCsv = () => {
    const headers = displayColumns.map((c) => c.key);
    const lines = [
      headers.join(","),
      ...filtered.map((row) =>
        headers.map((h) => `"${(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sheetvision-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-white">Data Tabel</h3>
          <p className="text-xs text-slate-400">
            {filtered.length} baris · klik header untuk sort
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari data..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              {displayColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1 text-indigo-400">{sortAsc ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-white/5 transition-colors hover:bg-indigo-500/5"
              >
                {displayColumns.map((col) => {
                  const val = row[col.key] || "—";
                  const badge = isBadgeColumn(col.key) && val !== "—";
                  return (
                    <td key={col.key} className="max-w-[180px] px-4 py-3">
                      {badge ? (
                        <span
                          className={cn(
                            "inline-block truncate rounded-md px-2 py-0.5 text-xs font-medium ring-1",
                            statusBadge(val) || "bg-white/5 text-slate-300 ring-white/10"
                          )}
                        >
                          {val}
                        </span>
                      ) : (
                        <span className="block truncate text-slate-300">{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageRows.length === 0 && (
        <div className="p-12 text-center text-sm text-slate-500">
          Tidak ada data yang cocok dengan pencarian.
        </div>
      )}

      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
        <span className="text-xs text-slate-500">
          Halaman {currentPage + 1} dari {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className={cn(
              "rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white",
              currentPage === 0 && "cursor-not-allowed opacity-40"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className={cn(
              "rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white",
              currentPage >= totalPages - 1 && "cursor-not-allowed opacity-40"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
