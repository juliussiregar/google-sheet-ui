import { NextRequest, NextResponse } from "next/server";
import { fetchSheetData, parseSheetUrl } from "@/lib/sheets";
import { analyzeSheetData } from "@/lib/analyzer";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body ?? {};

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL wajib diisi" }, { status: 400 });
    }

    if (!parseSheetUrl(url)) {
      return NextResponse.json(
        { error: "URL Google Sheet tidak valid. Pastikan format link benar." },
        { status: 400 }
      );
    }

    const rows = await fetchSheetData(url);
    const data = analyzeSheetData(rows, url);

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    const status = message.includes("tidak valid") ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
