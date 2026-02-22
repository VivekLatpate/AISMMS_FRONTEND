"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";

// Shared with analyze page – same input/venue shape
type VenueInfo = { name: string; type: string; capacity: string };
type PeakPeriod = { start: string; end: string; label: string; description: string };
type TrafficPrediction = { severity: string; congestion_index: number; confidence: number; peak_period: PeakPeriod };
type ImpactZone = { radius: string; level: number; roads_affected: string };
type LocationInfo = { latitude: number; longitude: number; google_maps_link: string };
type MetroStation = {
  station_name: string;
  distance_km?: number | null;
  walking_time_mins?: number | null;
  auto_time_mins?: number | null;
  lat?: number | null;
  lon?: number | null;
  google_maps_link?: string;
  error?: string;
  note?: string;
};
type WeatherInfo = {
  condition: string;
  temperature_c: number;
  feels_like_c: number;
  humidity_percent: number;
  wind_speed_kmh: number;
  visibility_km: number;
  traffic_weather_impact: string;
};
type MapplsTraffic = {
  "Distance (km)": number;
  "Travel Time (min)": number;
  "Traffic Delay (min)": number;
  "Average Speed (km/h)": number;
  "Congestion Level": string;
};
type EventContext = { likely_event_today: string; date: string; estimated_attendance: string };

type VenueInput = {
  venue: VenueInfo;
  event_context: EventContext;
  traffic_prediction: TrafficPrediction;
  impact_zones: ImpactZone[];
  location: LocationInfo;
  nearest_metro_station: MetroStation;
  weather: WeatherInfo;
  mappls_live_traffic: MapplsTraffic;
};

type SignalAction = {
  junction_area: string;
  east_west_green_time_sec: number;
  north_south_green_time_sec: number;
  reason: string;
};
type RiskAssessment = { choke_probability: number; crash_risk: number; pedestrian_density: string };
type MapFlags = { highlight_event_zone: boolean; highlight_congestion: boolean; show_metro_option: boolean; alert_level: string };

type DecisionOutput = {
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

type DataResponse = {
  inputs: VenueInput[];
  outputs: DecisionOutput[];
  total_records?: number;
  total_decisions?: number;
};

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    CLEAR: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    LOW: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    MODERATE: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    SEVERE: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  const cls = map[severity] ?? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{severity}</span>
  );
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

function AlertLevelBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    green: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    orange: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    red: "bg-red-500/20 text-red-700 dark:text-red-300",
  };
  const cls = map[level?.toLowerCase()] ?? "bg-slate-500/20 text-slate-700 dark:text-slate-300";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{level}</span>
  );
}

function InputCard({ data, index }: { data: VenueInput; index: number }) {
  const metro = data.nearest_metro_station;
  const hasMetroError = metro?.error || (metro?.distance_km == null && metro?.note);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/80 overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-400 to-green-600" />
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{data.venue.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {data.venue.type} · Capacity {data.venue.capacity}
            </p>
          </div>
          <SeverityBadge severity={data.traffic_prediction.severity} />
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Event today</p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{data.event_context.likely_event_today}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {data.event_context.date} · Est. {data.event_context.estimated_attendance}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <span>Congestion: <strong>{data.traffic_prediction.congestion_index}</strong></span>
          <span className="text-slate-400">·</span>
          <span>Confidence: {data.traffic_prediction.confidence}%</span>
        </div>
        {data.impact_zones?.length > 0 && (
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {data.impact_zones.slice(0, 2).map((z, i) => (
              <li key={i}><span className="font-medium">{z.radius}</span> — {z.roads_affected}</li>
            ))}
          </ul>
        )}
        <a
          href={data.location?.google_maps_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400"
        >
          View on Google Maps →
        </a>
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Nearest metro</p>
          {hasMetroError ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">{metro.station_name} {metro.note && `— ${metro.note}`}</p>
          ) : (
            <p className="text-sm text-slate-800 dark:text-slate-200">
              {metro.station_name} · {metro.distance_km != null ? `${metro.distance_km} km · Walk ${metro.walking_time_mins ?? "—"} min` : "—"}
            </p>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {data.weather.condition} · {data.weather.temperature_c}°C · {data.weather.traffic_weather_impact}
        </p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span>Distance: {data.mappls_live_traffic["Distance (km)"]} km</span>
          <span>Travel: {data.mappls_live_traffic["Travel Time (min)"]} min</span>
          <span>Speed: {data.mappls_live_traffic["Average Speed (km/h)"]} km/h</span>
          <span>Level: <strong>{data.mappls_live_traffic["Congestion Level"]}</strong></span>
        </div>
      </div>
    </motion.article>
  );
}

function DecisionCard({ data, index }: { data: DecisionOutput; index: number }) {
  const risk = data.risk_assessment;
  const flags = data.map_visualization_flags;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/80 overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-600" />
      <div className="p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Decision #{index + 1}
          </span>
          <div className="flex items-center gap-2">
            <PriorityBadge level={data.priority_level} />
            {flags?.alert_level && <AlertLevelBadge level={flags.alert_level} />}
          </div>
        </div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {data.decision_summary}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Review in {data.next_review_in_minutes} min</span>
          <span>·</span>
          <span>Confidence: {(data.confidence * 100).toFixed(0)}%</span>
        </div>

        {data.signal_actions?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Signal actions
            </p>
            <ul className="space-y-3">
              {data.signal_actions.map((s, i) => (
                <li key={i} className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
                  <p className="font-medium text-slate-800 dark:text-slate-200">{s.junction_area}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    E–W green: {s.east_west_green_time_sec}s · N–S green: {s.north_south_green_time_sec}s
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.traffic_management_actions?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Traffic management
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {data.traffic_management_actions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {data.public_advisories?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Public advisories
            </p>
            <ul className="space-y-2">
              {data.public_advisories.map((adv, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 border border-amber-100 dark:border-amber-800/50">
                  {adv}
                </li>
              ))}
            </ul>
          </div>
        )}

        {risk && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Risk assessment
            </p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Choke probability</p>
                <p className="font-medium text-slate-800 dark:text-white">{(risk.choke_probability * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Crash risk</p>
                <p className="font-medium text-slate-800 dark:text-white">{(risk.crash_risk * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Pedestrian density</p>
                <p className="font-medium text-slate-800 dark:text-white capitalize">{risk.pedestrian_density}</p>
              </div>
            </div>
          </div>
        )}

        {flags && (
          <div className="flex flex-wrap gap-2 text-xs">
            {flags.highlight_event_zone && <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5">Event zone</span>}
            {flags.highlight_congestion && <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5">Congestion</span>}
            {flags.show_metro_option && <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5">Metro option</span>}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function DataPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DataResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/data", { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Full data layer
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Venue & decision data
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
              All venue inputs and AI decisions from the traffic intelligence API.
            </p>
          </div>

          {loading && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading…</div>
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

          {!loading && !error && data && (
            <>
              <div className="flex flex-wrap items-center gap-4 mb-8 rounded-xl bg-slate-100 dark:bg-slate-800/50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <strong>{data.total_records ?? data.inputs?.length ?? 0}</strong> venue records
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  <strong>{data.total_decisions ?? data.outputs?.length ?? 0}</strong> decisions
                </span>
              </div>

              {data.inputs?.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                    Venue inputs ({data.inputs.length})
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {data.inputs.map((item, i) => (
                      <InputCard key={i} data={item} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {data.outputs?.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                    Decision outputs ({data.outputs.length})
                  </h2>
                  <div className="grid gap-5 lg:grid-cols-2">
                    {data.outputs.map((item, i) => (
                      <DecisionCard key={i} data={item} index={i} />
                    ))}
                  </div>
                </section>
              )}

              {(!data.inputs?.length && !data.outputs?.length) && (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">No inputs or outputs in response.</p>
              )}
            </>
          )}
        </div>
      </motion.main>
    </div>
  );
}
