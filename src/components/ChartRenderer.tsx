"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import { formatNumber, formatCurrency } from "@/lib/format";
import type { ChartConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ChartRendererProps {
  chart: ChartConfig;
  className?: string;
  large?: boolean;
}

function CustomTooltip({
  active,
  payload,
  label,
  isCurrency,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { name: string; percentage?: number } }>;
  label?: string;
  isCurrency?: boolean;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const name = item.name ?? label;
  const value = payload[0].value;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="text-xs text-slate-400">{name}</p>
      <p className="text-sm font-semibold text-white">
        {isCurrency ? formatCurrency(value) : formatNumber(value)}
      </p>
      {item.percentage !== undefined && (
        <p className="text-[10px] text-slate-500">{item.percentage.toFixed(1)}%</p>
      )}
    </div>
  );
}

export function ChartRenderer({ chart, className, large }: ChartRendererProps) {
  const { type, data, aggregation, valueKey } = chart;
  const isCurrency = aggregation !== "count" && !!valueKey;
  const gradientId = `area-${chart.id}`;

  if (data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center text-sm text-slate-500", large ? "h-96" : "h-64")}>
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  const chartContent = (() => {
    switch (type) {
      case "pie":
      case "donut":
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={type === "donut" ? (large ? 70 : 55) : 0}
              outerRadius={large ? 120 : 90}
              paddingAngle={2}
              label={({ name, percent }) => {
                const label = name ?? "";
                return `${label.length > 12 ? `${label.slice(0, 12)}…` : label} (${((percent ?? 0) * 100).toFixed(0)}%)`;
              }}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        );

      case "radial":
        return (
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={large ? "20%" : "15%"}
            outerRadius={large ? "90%" : "80%"}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background={{ fill: "rgba(255,255,255,0.05)" }}
              dataKey="value"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </RadialBar>
            <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </RadialBarChart>
        );

      case "horizontalBar":
        return (
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v: string) => (v.length > 14 ? `${v.slice(0, 14)}…` : v)}
            />
            <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={data} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: "#6366f1", r: 4 }}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={data} margin={{ left: 0, right: 16 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              fill={`url(#${gradientId})`}
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "bar":
      default:
        return (
          <BarChart data={data} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(v: string) => (v.length > 10 ? `${v.slice(0, 10)}…` : v)}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip isCurrency={isCurrency} />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  })();

  return (
    <div className={cn("w-full", large ? "h-96" : "h-72", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {chartContent}
      </ResponsiveContainer>
    </div>
  );
}
