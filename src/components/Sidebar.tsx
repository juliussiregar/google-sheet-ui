import type { ViewId } from "@/lib/types";
import {
  LayoutDashboard,
  BarChart3,
  Lightbulb,
  Table2,
  Columns3,
  Sheet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { id: ViewId; label: string; icon: typeof LayoutDashboard; desc: string }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, desc: "Ringkasan utama" },
  { id: "charts", label: "Grafik", icon: BarChart3, desc: "Semua visualisasi" },
  { id: "insights", label: "Insights", icon: Lightbulb, desc: "Analisis otomatis" },
  { id: "data", label: "Data", icon: Table2, desc: "Tabel lengkap" },
  { id: "columns", label: "Kolom", icon: Columns3, desc: "Profil kolom" },
];

interface SidebarProps {
  active: ViewId;
  onChange: (view: ViewId) => void;
  rowCount: number;
  className?: string;
}

export function Sidebar({ active, onChange, rowCount, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl",
        className
      )}
    >
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Sheet className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white">SheetVision</p>
            <p className="text-xs text-slate-500">{rowCount} baris aktif</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                isActive
                  ? "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="truncate text-[10px] text-slate-500">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export { NAV_ITEMS };
