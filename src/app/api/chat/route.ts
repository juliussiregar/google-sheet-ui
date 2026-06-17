import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatMessage } from "@/lib/types";
import type { DashboardAction, DashboardContext } from "@/lib/types";
import { getOpenAIConfig, getOpenAIConfigError } from "@/lib/openai-config";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `Kamu adalah asisten AI untuk aplikasi dashboard Google Sheet bernama SheetVision.
Jawab dalam Bahasa Indonesia yang ramah, jelas, dan profesional.

Kamu punya DUA peran:
1. **Analis data** — jawab pertanyaan tentang isi data, hitung, bandingkan, beri insight.
2. **Pengatur dashboard** — ubah tampilan dashboard user lewat perintah actions.

## Dashboard yang tersedia
- overview: ringkasan KPI, grafik utama, distribusi status, top records
- charts: galeri semua grafik (pie, donut, bar, area, dll)
- insights: insight otomatis & analisis pola data
- data: tabel interaktif dengan search & export CSV
- columns: profil & statistik tiap kolom

## Actions yang bisa kamu kirim
Kirim array "actions" untuk mengubah dashboard saat user meminta navigasi, filter, atau penyesuaian tampilan.

Tipe actions:
- { "type": "set_view", "view": "overview"|"charts"|"insights"|"data"|"columns" }
- { "type": "set_filter", "column": "nama kolom", "value": "nilai filter" }
- { "type": "set_filters", "filters": { "Kolom": "Nilai", ... } }
- { "type": "clear_filters" }

Contoh permintaan user → actions:
- "tampilkan grafik" → set_view charts
- "buka insights" → set_view insights
- "filter status akad saja" → set_filter column Status value Akad
- "tampilkan nasabah prioritas YA" → set_filter column "Nasabah Prioritas" value YA
- "reset filter" → clear_filters
- "tampilkan tabel dan filter cancel" → set_view data + set_filter Status Berkas Cancel

## Format respons WAJIB (JSON valid)
{
  "reply": "teks jawaban untuk user (boleh pakai bullet dengan • dan **tebal**)",
  "actions": []
}

Aturan:
- Gunakan fakta dari data sheet yang diberikan
- Jika user minta ubah tampilan/filter, SELALU sertakan actions yang sesuai
- Jika hanya tanya data tanpa ubah tampilan, actions boleh array kosong []
- column harus cocok dengan nama kolom di dashboardContext (key atau label)
- Nilai filter harus persis dengan values yang tersedia di dashboardContext
- reply jangan menyebut JSON atau actions — jelaskan secara natural apa yang kamu lakukan
- Format uang dalam Rupiah (IDR)`;

function parseChatResponse(raw: string): { reply: string; actions: DashboardAction[] } {
  try {
    const parsed = JSON.parse(raw) as { reply?: string; actions?: DashboardAction[] };
    return {
      reply: parsed.reply ?? raw,
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
    };
  } catch {
    return { reply: raw, actions: [] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = getOpenAIConfig();
    if (!config) {
      return NextResponse.json({ error: getOpenAIConfigError() }, { status: 503 });
    }

    const body = await request.json();
    const { messages, dataSummary, dashboardContext } = body ?? {};

    if (!dataSummary || typeof dataSummary !== "string") {
      return NextResponse.json({ error: "Data summary wajib ada" }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Format pesan tidak valid" }, { status: 400 });
    }

    const ctx = dashboardContext as DashboardContext | undefined;
    const contextBlock = ctx
      ? `\n\n--- DASHBOARD CONTEXT ---\nView aktif: ${ctx.activeView}\nFilter aktif: ${JSON.stringify(ctx.filters)}\nViews tersedia: ${ctx.views.join(", ")}\nKolom bisa difilter:\n${ctx.filterableColumns.map((c) => `- ${c.label} (key: ${c.key}): [${c.values.slice(0, 12).join(", ")}]`).join("\n")}\nGrafik tersedia: ${ctx.chartTitles.join("; ")}`
      : "";

    const openai = new OpenAI({ apiKey: config.apiKey });

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\n--- DATA SHEET ---\n${dataSummary}${contextBlock}`,
      },
      ...(messages as ChatMessage[]).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: chatMessages,
      temperature: 0.35,
      max_tokens: 1400,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? '{"reply":"Maaf, tidak ada respons.","actions":[]}';
    const { reply, actions } = parseChatResponse(raw);

    return NextResponse.json({ reply, actions });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menghubungi OpenAI";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
