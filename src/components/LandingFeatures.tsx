import {
  Link2,
  BarChart3,
  Bot,
  Zap,
  Shield,
  Layers,
} from "lucide-react";

const FEATURES = [
  {
    icon: Link2,
    title: "Paste & Go",
    desc: "Cukup paste link Google Sheet publik, dashboard langsung tersedia dalam hitungan detik.",
    color: "text-indigo-400 bg-indigo-500/10",
  },
  {
    icon: BarChart3,
    title: "12+ Grafik Otomatis",
    desc: "Pie, donut, bar, area, line, radial — dipilih otomatis berdasarkan tipe data kolom.",
    color: "text-violet-400 bg-violet-500/10",
  },
  {
    icon: Bot,
    title: "AI Data Assistant",
    desc: "Tanya isi data, minta saran visualisasi, dan dapatkan insight bisnis instan.",
    color: "text-cyan-400 bg-cyan-500/10",
  },
  {
    icon: Zap,
    title: "Filter Real-time",
    desc: "Filter berdasarkan status, kategori, atau cabang — semua grafik ikut terupdate.",
    color: "text-amber-400 bg-amber-500/10",
  },
  {
    icon: Layers,
    title: "Multi-View Dashboard",
    desc: "Overview, grafik, insights, tabel, profil kolom — semua dalam satu aplikasi.",
    color: "text-emerald-400 bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Gratis & Aman",
    desc: "Tanpa biaya hosting. API key OpenAI hanya untuk fitur chat, disimpan aman di server.",
    color: "text-rose-400 bg-rose-500/10",
  },
];

export function LandingFeatures() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Semua yang Anda butuhkan
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            Dari spreadsheet biasa menjadi dashboard profesional tanpa coding
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item, i) => (
            <div
              key={item.title}
              className={`animate-fade-in-up glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-xl stagger-${Math.min(i + 1, 6)}`}
            >
              <div
                className={`mb-4 inline-flex rounded-xl p-3 ${item.color} transition-transform group-hover:scale-110`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
