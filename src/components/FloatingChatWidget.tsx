"use client";

import { useState } from "react";
import { Bot, X, Sparkles } from "lucide-react";
import type { SheetData, ViewId } from "@/lib/types";
import type { DashboardAction } from "@/lib/types";
import { ChatPanel } from "./ChatPanel";
import { cn } from "@/lib/utils";

interface FloatingChatWidgetProps {
  data: SheetData;
  activeView: ViewId;
  filters: Record<string, string>;
  onApplyActions: (actions: DashboardAction[]) => void;
}

export function FloatingChatWidget({
  data,
  activeView,
  filters,
  onApplyActions,
}: FloatingChatWidgetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:bg-black/25"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-indigo-500/20 transition-all duration-300 ease-out",
          "right-4 bottom-[5.5rem] sm:right-6 sm:bottom-24",
          open
            ? "chat-pop-in pointer-events-auto w-[calc(100vw-1.5rem)] opacity-100 sm:w-[420px]"
            : "pointer-events-none h-0 w-0 border-0 opacity-0"
        )}
        style={open ? { height: "min(580px, calc(100vh - 7rem))" } : undefined}
        role="dialog"
        aria-label="AI Chat"
        aria-hidden={!open}
      >
        {open && (
          <ChatPanel
            data={data}
            activeView={activeView}
            filters={filters}
            onApplyActions={onApplyActions}
            onClose={() => setOpen(false)}
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat AI" : "Buka chat AI"}
        aria-expanded={open}
        className={cn(
          "group fixed bottom-6 right-6 z-50 flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95",
          open
            ? "bg-slate-800 text-white shadow-xl ring-2 ring-white/20 hover:bg-slate-700"
            : "bg-gradient-to-br from-indigo-500 via-violet-500 to-violet-600 text-white shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60"
        )}
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/30" />
        )}
        {open ? (
          <X className="relative h-6 w-6" />
        ) : (
          <>
            <Bot className="relative h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </span>
          </>
        )}
      </button>
    </>
  );
}
