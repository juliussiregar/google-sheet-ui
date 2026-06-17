import type { DashboardAction, ViewId } from "./types";

export type { DashboardAction, DashboardContext } from "./types";

export function findColumnKey(
  columnRef: string,
  columns: { key: string; label: string }[]
): string | null {
  const ref = columnRef.trim().toLowerCase();
  const exact = columns.find(
    (c) => c.key.toLowerCase() === ref || c.label.toLowerCase() === ref
  );
  if (exact) return exact.key;

  const partial = columns.find(
    (c) =>
      c.key.toLowerCase().includes(ref) ||
      c.label.toLowerCase().includes(ref) ||
      ref.includes(c.label.toLowerCase())
  );
  return partial?.key ?? null;
}

export function describeAction(
  action: DashboardAction,
  columns: { key: string; label: string }[]
): string {
  switch (action.type) {
    case "set_view": {
      const labels: Record<ViewId, string> = {
        overview: "Overview",
        charts: "Grafik",
        insights: "Insights",
        data: "Tabel Data",
        columns: "Profil Kolom",
      };
      return `Buka ${labels[action.view]}`;
    }
    case "set_filter": {
      const key = findColumnKey(action.column, columns);
      const label = columns.find((c) => c.key === key)?.label ?? action.column;
      return `Filter ${label}: ${action.value}`;
    }
    case "set_filters":
      return `Terapkan ${Object.keys(action.filters).length} filter`;
    case "clear_filters":
      return "Reset semua filter";
    default:
      return "Update dashboard";
  }
}
