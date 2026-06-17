# SheetVision

Ubah Google Sheet menjadi dashboard interaktif — gratis (kecuali OpenAI untuk fitur chat).

## Fitur

- Paste link Google Sheet → dashboard otomatis
- Multi-view: Overview, Grafik, Insights, Tabel, Kolom, AI Chat
- KPI cards, pie/donut/bar/area/radial charts
- Filter real-time & export CSV
- AI Chat (OpenAI) untuk analisis data & saran visualisasi

## Setup Lokal

```bash
npm install
cp .env.example .env.local
# Edit .env.local — masukkan OPENAI_API_KEY Anda
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

> Dashboard & grafik berjalan tanpa API key. Fitur **AI Chat** membutuhkan `OPENAI_API_KEY`.

## Syarat Google Sheet

Sheet harus di-share sebagai **"Anyone with the link can view"** agar data bisa diambil tanpa OAuth.

## Deploy ke Vercel

### 1. Push ke GitHub

```bash
git add .
git commit -m "feat: SheetVision dashboard siap deploy"
git branch -M main
git remote add origin https://github.com/USERNAME/google-sheet-tampilan.git
git push -u origin main
```

### 2. Import & Deploy

1. Buka [vercel.com/new](https://vercel.com/new)
2. Import repository GitHub Anda
3. Framework: **Next.js** (otomatis terdeteksi)
4. Tambahkan **Environment Variables**:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | API key OpenAI Anda |
| `OPENAI_MODEL` | `gpt-4o-mini` *(opsional)* |

5. Klik **Deploy**

### Keamanan

- **Jangan** hardcode API key di source code
- **Jangan** commit file `.env` atau `.env.local`
- Simpan API key hanya di Vercel Environment Variables atau `.env.local` lokal

## Tech Stack

- Next.js 16 + React + TypeScript
- Tailwind CSS
- Recharts
- Papa Parse
- OpenAI API
