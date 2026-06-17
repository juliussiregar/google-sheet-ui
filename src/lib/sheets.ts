import Papa from "papaparse";

export interface ParsedSheetUrl {
  spreadsheetId: string;
  gid: string;
}

export function parseSheetUrl(url: string): ParsedSheetUrl | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const idMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!idMatch) return null;

  const gidMatch = trimmed.match(/[#&?]gid=(\d+)/);
  const gid = gidMatch?.[1] ?? "0";

  return { spreadsheetId: idMatch[1], gid };
}

export function getCsvExportUrl(spreadsheetId: string, gid: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
}

export function isSummaryRow(row: Record<string, string>): boolean {
  const values = Object.values(row).map((v) => v?.trim() ?? "");
  const normalized = values.map((v) => v.toLowerCase());

  if (values.every((v) => !v)) return true;
  if (normalized.some((v) => v === "total")) return true;
  if (normalized.includes("no") && normalized.includes("nama debitur")) return true;

  return false;
}

function isHtmlResponse(text: string): boolean {
  const snippet = text.trim().slice(0, 200).toLowerCase();
  return snippet.startsWith("<!doctype") || snippet.startsWith("<html");
}

export async function fetchSheetData(url: string): Promise<Record<string, string>[]> {
  const parsed = parseSheetUrl(url);
  if (!parsed) {
    throw new Error("URL Google Sheet tidak valid. Pastikan format link benar.");
  }

  const csvUrl = getCsvExportUrl(parsed.spreadsheetId, parsed.gid);

  const response = await fetch(csvUrl, {
    cache: "no-store",
    headers: {
      "User-Agent": "SheetVision/1.0",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(
      "Gagal mengambil data. Pastikan sheet di-share sebagai 'Anyone with the link can view'."
    );
  }

  const csvText = await response.text();

  if (isHtmlResponse(csvText)) {
    throw new Error(
      "Sheet tidak dapat diakses. Ubah pengaturan share menjadi 'Anyone with the link can view'."
    );
  }

  if (!csvText.trim()) {
    throw new Error("Sheet kosong atau tab tidak ditemukan. Periksa gid di URL.");
  }

  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error("Gagal mem-parse data CSV dari Google Sheet.");
  }

  const rows = result.data
    .map((row) => {
      const cleaned: Record<string, string> = {};
      for (const [key, value] of Object.entries(row)) {
        if (key && key.trim()) {
          cleaned[key.trim()] = typeof value === "string" ? value.trim() : String(value ?? "");
        }
      }
      return cleaned;
    })
    .filter((row) => Object.keys(row).length > 0 && !isSummaryRow(row));

  if (rows.length === 0) {
    throw new Error("Tidak ada data valid di sheet. Periksa isi sheet dan header kolom.");
  }

  return rows;
}
