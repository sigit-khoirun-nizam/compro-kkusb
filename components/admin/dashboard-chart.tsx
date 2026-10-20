"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data6Months = [
  { period: "Nov 2025", artikel: 2, pesan: 8, total: 10 },
  { period: "Des 2025", artikel: 3, pesan: 14, total: 17 },
  { period: "Jan 2026", artikel: 5, pesan: 19, total: 24 },
  { period: "Feb 2026", artikel: 4, pesan: 16, total: 20 },
  { period: "Mar 2026", artikel: 6, pesan: 28, total: 34 },
  { period: "Apr 2026", artikel: 2, pesan: 11, total: 13 },
]

const data30Days = [
  { period: "Minggu 1", artikel: 1, pesan: 5, total: 6 },
  { period: "Minggu 2", artikel: 2, pesan: 8, total: 10 },
  { period: "Minggu 3", artikel: 2, pesan: 9, total: 11 },
  { period: "Minggu 4", artikel: 1, pesan: 6, total: 7 },
]

export function DashboardChart() {
  const [range, setRange] = useState<"6m" | "30d">("6m")
  const chartData = range === "6m" ? data6Months : data30Days

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Aktivitas Konten & Layanan Pesan Masuk
          </span>
          <p className="text-[11px] text-zinc-500">
            Pencatatan riil pembaruan artikel CMS dan formulir kontak yang diterima
          </p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setRange("6m")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              range === "6m"
                ? "bg-white dark:bg-zinc-900 text-[#075C35] dark:text-emerald-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            6 Bulan Terakhir
          </button>
          <button
            type="button"
            onClick={() => setRange("30d")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
              range === "30d"
                ? "bg-white dark:bg-zinc-900 text-[#075C35] dark:text-emerald-400 shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
            }`}
          >
            30 Hari Terakhir
          </button>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-[280px] w-full min-w-0" style={{ minHeight: 280, width: "100%" }}>
        {!mounted ? (
          <div className="h-full w-full rounded-lg bg-zinc-100/60 dark:bg-zinc-800/40 animate-pulse flex items-center justify-center text-xs text-zinc-400">
            Memuat grafik aktivitas...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={270} minWidth={100} debounce={50}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPesan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#079B49" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#079B49" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorArtikel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F4C430" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F4C430" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E9E5" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "#69716C", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fill: "#69716C", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E4E9E5",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#202522", marginBottom: "4px" }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
            />
            <Area
              type="monotone"
              name="Pesan Masuk"
              dataKey="pesan"
              stroke="#079B49"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPesan)"
            />
            <Area
              type="monotone"
              name="Artikel Berita"
              dataKey="artikel"
              stroke="#F4C430"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorArtikel)"
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
        <span>Metrik: Rekam log audit sistem CMS KKUSB</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Sinkronisasi Terhubung
        </span>
      </div>
    </div>
  )
}
