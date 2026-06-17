"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  RefreshCw,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import type { SheetData, ViewId } from "@/lib/types";
import { reanalyze, getFilterableColumns, type Filters } from "@/lib/filters";
import type { DashboardAction } from "@/lib/types";
import { findColumnKey } from "@/lib/chat-actions";
import { LinkInput } from "./LinkInput";
import { KPICards } from "./KPICards";
import { ChartCard } from "./ChartCard";
import { DataTable } from "./DataTable";
import { FloatingChatWidget } from "./FloatingChatWidget";
import { Sidebar, NAV_ITEMS } from "./Sidebar";
import { FilterBar } from "./FilterBar";
import { StatusDistribution } from "./StatusDistribution";
import { InsightsPanel } from "./InsightsPanel";
import { TopRecords } from "./TopRecords";
import { ColumnInsights } from "./ColumnInsights";
import { HeroChart } from "./HeroChart";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { LandingFeatures } from "./LandingFeatures";
import { SectionHeader } from "./SectionHeader";
import { SavedSheetsMenu } from "./SavedSheetsMenu";
import {
  getLastUrl,
  setLastUrl as persistLastUrl,
  syncSheetToUrl,
  touchSavedSheet,
  truncateUrl,
} from "@/lib/sheet-storage";
import { cn } from "@/lib/utils";

export function DashboardApp() {
  const searchParams = useSearchParams();
  const initRef = useRef(false);

  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewId>("overview");
  const [filters, setFilters] = useState<Filters>({});
  const [lastUrl, setLastUrl] = useState("");
  const [heroCollapsed, setHeroCollapsed] = useState(true);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const loadSheet = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setLastUrl(url);
    setFilters({});
    setShowLinkEditor(false);

    try {
      const res = await fetch("/api/sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memuat data");
      setError(null);
      setSheetData(json);
      setActiveView("overview");
      setHeroCollapsed(true);
      persistLastUrl(url);
      syncSheetToUrl(url);
      touchSavedSheet(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const fromParam = searchParams.get("sheet");
    const url = fromParam || getLastUrl();
    if (url) {
      setLastUrl(url);
      loadSheet(url);
    }
  }, [searchParams, loadSheet]);

  const displayData = useMemo(() => {
    if (!sheetData) return null;
    return reanalyze(sheetData, filters);
  }, [sheetData, filters]);

  const filterableColumns = useMemo(
    () => (sheetData ? getFilterableColumns(sheetData) : []),
    [sheetData]
  );

  const featuredChart = displayData?.charts.find((c) => c.featured) ?? displayData?.charts[0];

  const applyChatActions = useCallback(
    (actions: DashboardAction[]) => {
      if (!sheetData) return;
      const columns = sheetData.columns;

      for (const action of actions) {
        switch (action.type) {
          case "set_view":
            setActiveView(action.view);
            setMobileNav(false);
            break;
          case "set_filter": {
            const key = findColumnKey(action.column, columns);
            if (key && action.value) {
              setFilters((prev) => ({ ...prev, [key]: action.value }));
            }
            break;
          }
          case "set_filters": {
            const next: Filters = {};
            for (const [col, val] of Object.entries(action.filters)) {
              const key = findColumnKey(col, columns);
              if (key && val) next[key] = val;
            }
            setFilters((prev) => ({ ...prev, ...next }));
            break;
          }
          case "clear_filters":
            setFilters({});
            break;
        }
      }
    },
    [sheetData]
  );

  const renderView = () => {
    if (!displayData || !sheetData) return null;

    switch (activeView) {
      case "overview":
        return (
          <div className="space-y-6">
            <KPICards metrics={displayData.kpis} />
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <HeroChart chart={featuredChart} />
              </div>
              <div className="lg:col-span-2">
                <StatusDistribution items={displayData.distributions} />
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <TopRecords records={displayData.topRecords} />
              <div className="glass-card rounded-2xl p-5">
                <SectionHeader
                  title="Grafik Ringkas"
                  description="Preview visualisasi utama"
                />
                <div className="grid gap-4">
                  {displayData.charts.slice(0, 2).map((chart) => (
                    <ChartCard key={chart.id} chart={chart} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "charts":
        return (
          <div className="space-y-6">
            <SectionHeader
              title="Galeri Grafik"
              description={`${displayData.charts.length} visualisasi · klik tipe grafik untuk mengganti tampilan`}
            />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {displayData.charts.map((chart, i) => (
                <ChartCard
                  key={chart.id}
                  chart={chart}
                  defaultLarge={i === 0}
                  className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}
                />
              ))}
            </div>
            {displayData.charts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center text-slate-500">
                Tidak ada grafik untuk data yang difilter.
              </div>
            )}
          </div>
        );

      case "insights":
        return (
          <div className="space-y-6">
            <InsightsPanel insights={displayData.insights} />
            <div className="grid gap-6 lg:grid-cols-2">
              <StatusDistribution
                items={displayData.distributions}
                title="Breakdown Kategori"
              />
              <TopRecords records={displayData.topRecords} title="Ranking Tertinggi" />
            </div>
          </div>
        );

      case "data":
        return <DataTable rows={displayData.rows} columns={displayData.columns} />;

      case "columns":
        return <ColumnInsights columns={displayData.columns} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-grid">
      {/* Landing hero — collapses when data loaded */}
      <section
        className={cn(
          "relative border-b border-white/10 transition-all duration-500",
          sheetData && heroCollapsed && !showLinkEditor ? "hidden" : "block"
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              SheetVision · Dashboard Generator
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ubah Google Sheet jadi{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Dashboard Interaktif
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
              {showLinkEditor
                ? "Masukkan link baru atau pilih dari link tersimpan."
                : "Paste link, dapatkan multi-view dashboard. Link otomatis tersimpan di browser & URL."}
            </p>
          </div>

          <div className="flex justify-center">
            <LinkInput onSubmit={loadSheet} loading={loading} initialUrl={lastUrl} />
          </div>

          {sheetData && showLinkEditor && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowLinkEditor(false)}
                className="text-xs text-slate-500 hover:text-white"
              >
                ← Kembali ke dashboard
              </button>
            </div>
          )}

          {error && (
            <div className="mx-auto mt-4 max-w-3xl rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
              {error}
            </div>
          )}

          {!sheetData && (
            <div className="mt-6 flex justify-center">
              <SavedSheetsMenu
                currentUrl={lastUrl || undefined}
                onSelect={loadSheet}
                onChangeLink={() => {
                  document.getElementById("sheet-link-input")?.focus();
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* Compact header when data loaded */}
      {sheetData && (
        <header className="sticky top-0 z-50 overflow-visible border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNav(!mobileNav)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
              >
                {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">SheetVision</p>
                <p className="truncate text-[10px] text-slate-500" title={lastUrl}>
                  {displayData?.rows.length ?? 0} baris
                  {lastUrl && ` · ${truncateUrl(lastUrl, 28)}`}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <SavedSheetsMenu
                currentUrl={lastUrl}
                onSelect={loadSheet}
                onChangeLink={() => {
                  setShowLinkEditor(true);
                  setHeroCollapsed(false);
                }}
              />
              <button
                onClick={() => loadSheet(lastUrl)}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <a
                href={sheetData.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sheet</span>
              </a>
            </div>
          </div>
          {error && (
            <div className="border-t border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-xs text-red-300 sm:px-6">
              {error}
            </div>
          )}
        </header>
      )}

      {loading && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <LoadingSkeleton />
        </div>
      )}

      {sheetData && displayData && !loading && !showLinkEditor && (
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Desktop sidebar */}
          <Sidebar
            active={activeView}
            onChange={setActiveView}
            rowCount={displayData.rows.length}
            className="hidden w-56 shrink-0 lg:flex"
          />

          {/* Mobile nav overlay */}
          {mobileNav && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setMobileNav(false)}
              />
              <Sidebar
                active={activeView}
                onChange={(v) => {
                  setActiveView(v);
                  setMobileNav(false);
                }}
                rowCount={displayData.rows.length}
                className="absolute left-0 top-0 h-full w-64"
              />
            </div>
          )}

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
              {/* Mobile tabs */}
              <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-slate-900/50 p-1 lg:hidden">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      activeView === item.id
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "text-slate-400"
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                ))}
              </div>

              {filterableColumns.length > 0 && activeView !== "columns" && (
                <FilterBar
                  columns={filterableColumns}
                  filters={filters}
                  onChange={setFilters}
                  rows={sheetData.rows}
                  totalRows={sheetData.rows.length}
                />
              )}

              <div key={`${activeView}-${JSON.stringify(filters)}`} className="animate-fade-in">
                {renderView()}
              </div>
            </div>
          </main>

          {displayData && (
            <FloatingChatWidget
              data={displayData}
              activeView={activeView}
              filters={filters}
              onApplyActions={applyChatActions}
            />
          )}
        </div>
      )}

      {!sheetData && !loading && !error && <LandingFeatures />}
    </div>
  );
}
