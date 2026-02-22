"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import {
  TrafficCone,
  Shield,
  MapPin,
  AlertTriangle,
  Clock,
  Gauge,
} from "lucide-react";

type SignalAction = {
  junction_area: string;
  east_west_green_time_sec: number;
  north_south_green_time_sec: number;
  reason: string;
};

type RiskAssessment = {
  choke_probability: number;
  crash_risk: number;
  pedestrian_density: string;
};

type MapFlags = {
  highlight_event_zone: boolean;
  highlight_congestion: boolean;
  show_metro_option: boolean;
  alert_level: string;
};

type Decision = {
  decision_summary: string;
  priority_level: string;
  signal_actions: SignalAction[];
  traffic_management_actions: string[];
  public_advisories: string[];
  risk_assessment: RiskAssessment;
  map_visualization_flags: MapFlags;
  next_review_in_minutes: number;
  confidence: number;
};

function normalizeOutput(data: unknown): Decision[] {
  if (Array.isArray(data) && data.length > 0 && data.every((x) => x && typeof x === "object" && "decision_summary" in x)) {
    return data as Decision[];
  }
  if (data && typeof data === "object" && "outputs" in (data as Record<string, unknown>)) {
    const out = (data as { outputs: unknown }).outputs;
    return Array.isArray(out) ? (out as Decision[]) : [];
  }
  return [];
}

function PriorityBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  const cls = map[level?.toLowerCase()] ?? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {level}
    </span>
  );
}

function AlertLevelPill({ level }: { level: string }) {
  const map: Record<string, string> = {
    green: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    orange: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    red: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  };
  const cls = map[level?.toLowerCase()] ?? "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {level}
    </span>
  );
}

function RiskBarChart({ risk }: { risk: RiskAssessment }) {
  const choke = Math.round(risk.choke_probability * 100);
  const crash = Math.round(risk.crash_risk * 100);
  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Choke probability</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{choke}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${choke}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-amber-500"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Crash risk</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">{crash}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${crash}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-red-400"
          />
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Pedestrian density: <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{risk.pedestrian_density}</span>
      </p>
    </div>
  );
}

function SignalTimesBar({ ew, ns }: { ew: number; ns: number }) {
  const max = Math.max(ew, ns, 1);
  return (
    <div className="flex items-end gap-2 h-10">
      <div className="flex-1 flex flex-col items-center gap-0.5">
        <div
          className="w-full rounded-t bg-green-500 min-h-[6px]"
          style={{ height: `${(ew / max) * 100}%`, minHeight: 6 }}
        />
        <span className="text-[10px] text-slate-500">E–W {ew}s</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-0.5">
        <div
          className="w-full rounded-t bg-blue-500 min-h-[6px]"
          style={{ height: `${(ns / max) * 100}%`, minHeight: 6 }}
        />
        <span className="text-[10px] text-slate-500">N–S {ns}s</span>
      </div>
    </div>
  );
}

function DecisionCard({ decision, index }: { decision: Decision; index: number }) {
  const flags = decision.map_visualization_flags ?? {};
  const risk = decision.risk_assessment;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/80 overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-400 to-green-600" />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-bold">
              {index + 1}
            </span>
            <PriorityBadge level={decision.priority_level} />
            {flags.alert_level && <AlertLevelPill level={flags.alert_level} />}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Review in {decision.next_review_in_minutes} min
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" />
              {(decision.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {decision.decision_summary}
        </p>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* 1. Traffic signal */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                <TrafficCone className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Traffic signal
              </h3>
            </div>
            {decision.signal_actions?.length ? (
              <ul className="space-y-4">
                {decision.signal_actions.map((s, i) => (
                  <li key={i} className="rounded-lg bg-white dark:bg-slate-800/50 p-3 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {s.junction_area}
                    </p>
                    <div className="mt-2">
                      <SignalTimesBar ew={s.east_west_green_time_sec} ns={s.north_south_green_time_sec} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {s.reason}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">No signal changes.</p>
            )}
          </div>

          {/* 2. Police duty */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Police duty
              </h3>
            </div>
            {decision.traffic_management_actions?.length ? (
              <ul className="space-y-2">
                {decision.traffic_management_actions.map((action, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    {action}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">No actions.</p>
            )}
          </div>

          {/* 3. Navigation (public advisories) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Navigation
              </h3>
            </div>
            {decision.public_advisories?.length ? (
              <ul className="space-y-2">
                {decision.public_advisories.map((adv, i) => (
                  <li
                    key={i}
                    className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    {adv}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">No advisories.</p>
            )}
          </div>
        </div>

        {/* Risk + Map flags row */}
        <div className="grid gap-4 sm:grid-cols-2">
          {risk && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Risk assessment
                </h3>
              </div>
              <RiskBarChart risk={risk} />
            </div>
          )}
          {flags && (flags.highlight_event_zone != null || flags.alert_level) && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                Map visualization
              </h3>
              <div className="flex flex-wrap gap-2">
                {flags.highlight_event_zone && (
                  <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                    Event zone
                  </span>
                )}
                {flags.highlight_congestion && (
                  <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                    Congestion
                  </span>
                )}
                {flags.show_metro_option && (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Metro option
                  </span>
                )}
                {flags.alert_level && <AlertLevelPill level={flags.alert_level} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function SummaryGraph({ decisions }: { decisions: Decision[] }) {
  const confidences = decisions.map((d) => d.confidence * 100);
  const priorities = useMemo(() => {
    const m: Record<string, number> = { low: 0, medium: 0, high: 0 };
    decisions.forEach((d) => {
      const p = (d.priority_level ?? "low").toLowerCase();
      m[p] = (m[p] ?? 0) + 1;
    });
    return [
      { label: "Low", value: m.low ?? 0, color: "bg-emerald-500" },
      { label: "Medium", value: m.medium ?? 0, color: "bg-amber-500" },
      { label: "High", value: m.high ?? 0, color: "bg-red-500" },
    ];
  }, [decisions]);
  const maxConf = Math.max(...confidences, 1);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/80 overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-r from-green-600 via-slate-400 to-green-600" />
      <div className="p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Single control plane — overview
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Confidence by decision</p>
            <div className="flex items-end gap-1.5 h-24">
              {confidences.map((c, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(c / maxConf) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full max-w-[20px] rounded-t bg-green-500 min-h-[4px]"
                  />
                  <span className="text-[10px] text-slate-500">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">Priority distribution</p>
            <div className="flex items-end gap-3 h-24">
              {priorities.map((p, i) => {
                const pct = decisions.length ? (p.value / decisions.length) * 100 : 0;
                const barHeight = Math.max(12, (pct / 100) * 72);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: barHeight }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                      className={`w-full rounded-t min-h-[8px] ${p.color}`}
                    />
                    <span className="text-[10px] text-slate-500">{p.label}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{p.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function OutputPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<unknown>(null);

  const decisions = useMemo(() => normalizeOutput(raw), [raw]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/output", { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then(setRaw)
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fa] via-white to-gray-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-16 px-4 md:px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Decision output
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Single control plane
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
              Traffic signal · Police duty · Navigation — clean, actionable outputs with graphs.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
            </div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-red-600 dark:text-red-400 py-4"
            >
              {error}
            </motion.p>
          )}

          {!loading && !error && decisions.length > 0 && (
            <>
              <SummaryGraph decisions={decisions} />
              <div className="mt-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Decisions ({decisions.length})
                </h2>
                <div className="space-y-6">
                  {decisions.map((d, i) => (
                    <DecisionCard key={i} decision={d} index={i} />
                  ))}
                </div>
              </div>
            </>
          )}

          {!loading && !error && decisions.length === 0 && raw != null && (
            <p className="text-center text-slate-500 dark:text-slate-400 py-12">
              No decision output in response.
            </p>
          )}
        </div>
      </motion.main>
    </div>
  );
}
