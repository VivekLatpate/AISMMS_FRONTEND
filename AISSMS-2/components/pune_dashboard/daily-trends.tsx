"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

type TrendPoint = { label: string; value: number };

const lastTwoWeeks: TrendPoint[] = [
  { label: "02/05", value: 54 },
  { label: "02/06", value: 58 },
  { label: "02/07", value: 61 },
  { label: "02/08", value: 66 },
  { label: "02/09", value: 64 },
  { label: "02/10", value: 59 },
  { label: "02/11", value: 52 },
  { label: "02/12", value: 47 },
  { label: "02/13", value: 45 },
  { label: "02/14", value: 51 },
  { label: "02/15", value: 60 },
  { label: "02/16", value: 67 },
  { label: "02/17", value: 63 },
  { label: "02/18", value: 69 },
];

const baseline: TrendPoint[] = [
  { label: "02/05", value: 50 },
  { label: "02/06", value: 52 },
  { label: "02/07", value: 55 },
  { label: "02/08", value: 57 },
  { label: "02/09", value: 56 },
  { label: "02/10", value: 53 },
  { label: "02/11", value: 49 },
  { label: "02/12", value: 46 },
  { label: "02/13", value: 45 },
  { label: "02/14", value: 47 },
  { label: "02/15", value: 51 },
  { label: "02/16", value: 54 },
  { label: "02/17", value: 52 },
  { label: "02/18", value: 55 },
];

function buildLinePath(data: TrendPoint[], w: number, h: number, pad: number) {
  const max = 100;
  const min = 0;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;

  const xStep = innerW / Math.max(1, data.length - 1);

  const coords = data.map((p, i) => {
    const x = pad + i * xStep;
    const t = (p.value - min) / (max - min);
    const y = pad + (1 - t) * innerH;
    return { x, y };
  });

  const d = coords
    .map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`))
    .join(" ");

  return { d, coords };
}

import { motion, AnimatePresence } from "framer-motion";

const predictedData: TrendPoint[] = lastTwoWeeks.map(p => ({ ...p, value: p.value * 0.8 }));
const optimizedData: TrendPoint[] = lastTwoWeeks.map(p => ({ ...p, value: p.value * 0.65 + 10 }));

export function PuneDailyTrends() {
  const [mode, setMode] = React.useState<"live" | "predicted" | "optimized">("live");

  const { activeLine, baseLine, activeArea, tickLabels } = useMemo(() => {
    const w = 640;
    const h = 220;
    const pad = 16;

    const data = mode === "live" ? lastTwoWeeks : mode === "predicted" ? predictedData : optimizedData;
    const active = buildLinePath(data, w, h, pad);
    const base = buildLinePath(baseline, w, h, pad);

    const area = `${active.d} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`;

    const ticks = lastTwoWeeks
      .map((p, i) => ({ label: p.label, i }))
      .filter((_, idx) => idx === 0 || idx === 4 || idx === 8 || idx === 12);

    return {
      activeLine: active.d,
      baseLine: base.d,
      activeArea: area,
      tickLabels: ticks,
    };
  }, [mode]);

  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.1 }
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_18px_45px_rgba(15,23,42,0.6)]"
    >
      <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Analytics State Morphing
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Native geometry interpolation across data states
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start md:self-center">
          {(["live", "predicted", "optimized"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all rounded-md",
                mode === m ? "bg-white dark:bg-slate-900 text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-6 rounded-full bg-green-500" />
            {mode.toUpperCase()}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-6 rounded-full bg-slate-300" />
            Baseline
          </span>
        </div>
      </header>

      <div className="relative w-full">
        <svg
          viewBox="0 0 640 220"
          className="h-[240px] w-full"
          aria-label="Daily congestion trends chart"
        >
          <defs>
            <linearGradient id="periodFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(52, 211, 153, 0.38)" />
              <stop offset="100%" stopColor="rgba(52, 211, 153, 0.0)" />
            </linearGradient>
            <linearGradient id="lineGlow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="55%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {[25, 50, 75].map((t) => {
            const y = 16 + (1 - t / 100) * (220 - 32);
            return (
              <g key={t}>
                <line
                  x1="16"
                  x2="624"
                  y1={y}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.18)"
                  strokeWidth="1"
                />
                <text
                  x="12"
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(100, 116, 139, 0.75)"
                >
                  {t}
                </text>
              </g>
            );
          })}

          <motion.path
            animate={{ d: activeArea }}
            transition={{ duration: 1, ease: "easeInOut" }}
            fill="url(#periodFill)"
          />
          <motion.path
            initial={{ d: baseLine, pathLength: 0 }}
            animate={{ d: baseLine, pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            fill="none"
            stroke="rgba(148, 163, 184, 0.55)"
            strokeWidth="2"
          />
          <motion.path
            animate={{ d: activeLine }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            fill="none"
            stroke="url(#lineGlow)"
            strokeWidth="3"
          />

          {tickLabels.map((t) => {
            const x = 16 + t.i * ((640 - 32) / (lastTwoWeeks.length - 1));
            return (
              <text
                key={t.label}
                x={x}
                y="214"
                textAnchor="middle"
                fontSize="10"
                fill="rgba(100, 116, 139, 0.75)"
              >
                {t.label}
              </text>
            );
          })}
        </svg>

        <p
          className={cn(
            "mt-2 text-xs text-slate-500 dark:text-slate-400",
            "flex items-center justify-between gap-2",
          )}
        >
          <span>Index is illustrative until live feeds are wired.</span>
          <span className="text-slate-700 dark:text-slate-300">
            Peak day:{" "}
            <span className="font-semibold text-orange-600 dark:text-orange-300">
              02/18
            </span>
          </span>
        </p>
      </div>
    </motion.section>
  );
}

