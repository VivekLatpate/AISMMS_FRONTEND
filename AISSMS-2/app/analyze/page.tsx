"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";

type VenueInfo = {
  name: string;
  type: string;
  capacity: string;
};

type PeakPeriod = {
  start: string;
  end: string;
  label: string;
  description: string;
};

type TrafficPrediction = {
  severity: string;
  congestion_index: number;
  confidence: number;
  peak_period: PeakPeriod;
};

type ImpactZone = {
  radius: string;
  level: number;
  roads_affected: string;
};

type LocationInfo = {
  latitude: number;
  longitude: number;
  google_maps_link: string;
};

type MetroStation = {
  station_name: string;
  distance_km?: number;
  walking_time_mins?: number;
  auto_time_mins?: number;
  lat?: number;
  lon?: number;
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

type EventContext = {
  likely_event_today: string;
  date: string;
  estimated_attendance: string;
};

type AnalyzeResult = {
  venue: VenueInfo;
  event_context: EventContext;
  traffic_prediction: TrafficPrediction;
  impact_zones: ImpactZone[];
  location: LocationInfo;
  nearest_metro_station: MetroStation;
  weather: WeatherInfo;
  mappls_live_traffic: MapplsTraffic;
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {severity}
    </span>
  );
}

function ResultCard({ data, index }: { data: AnalyzeResult; index: number }) {
  const metro = data.nearest_metro_station;
  const hasMetroError = "error" in metro && metro.error;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/80 overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-400 to-green-600" />

      <div className="p-5 space-y-5">
        {/* Venue + Traffic severity */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {data.venue.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {data.venue.type} · Capacity {data.venue.capacity}
            </p>
          </div>
          <SeverityBadge severity={data.traffic_prediction.severity} />
        </div>

        {/* Event today */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Event today
          </p>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {data.event_context.likely_event_today}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {data.event_context.date} · Est. attendance: {data.event_context.estimated_attendance}
          </p>
        </div>

        {/* Traffic prediction */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Traffic prediction
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span>Congestion index: <strong>{data.traffic_prediction.congestion_index}</strong></span>
            <span className="text-slate-400">·</span>
            <span>Confidence: {data.traffic_prediction.confidence}%</span>
          </div>
          {data.traffic_prediction.peak_period?.label && data.traffic_prediction.peak_period.label !== "N/A" && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Peak: {data.traffic_prediction.peak_period.label} — {data.traffic_prediction.peak_period.description}
            </p>
          )}
        </div>

        {/* Impact zones */}
        {data.impact_zones?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Impact zones
            </p>
            <ul className="space-y-1.5">
              {data.impact_zones.map((z, i) => (
                <li key={i} className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{z.radius}</span> (level {z.level}): {z.roads_affected}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2">
          <a
            href={data.location.google_maps_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            View on Google Maps →
          </a>
        </div>

        {/* Metro */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Nearest metro
          </p>
          {hasMetroError ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">{metro.station_name} — {metro.note}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{metro.station_name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {metro.distance_km} km · Walk {metro.walking_time_mins} min · Auto {metro.auto_time_mins} min
              </p>
              {metro.google_maps_link && (
                <a
                  href={metro.google_maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:underline mt-1 inline-block"
                >
                  Directions
                </a>
              )}
            </>
          )}
        </div>

        {/* Weather */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 dark:text-slate-300">
          <span>{data.weather.condition}</span>
          <span>{data.weather.temperature_c}°C (feels {data.weather.feels_like_c}°C)</span>
          <span>{data.weather.humidity_percent}% humidity</span>
          <span>{data.weather.wind_speed_kmh} km/h wind</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{data.weather.traffic_weather_impact}</p>

        {/* Live traffic */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Live traffic (Mappls)
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span>Distance: {data.mappls_live_traffic["Distance (km)"]} km</span>
            <span>Travel time: {data.mappls_live_traffic["Travel Time (min)"]} min</span>
            <span>Avg speed: {data.mappls_live_traffic["Average Speed (km/h)"]} km/h</span>
            <span>Congestion: <strong>{data.mappls_live_traffic["Congestion Level"]}</strong></span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function AnalyzePage() {
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalyzeResult[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = venue.trim();
    if (!value) return;
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venue: value }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fa] via-white to-gray-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-16 px-4 md:px-6"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Venue traffic intelligence
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Analyze venue traffic
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
              Enter a venue name to get event context, traffic prediction, weather and live traffic.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. VIT Pune, Wankhede stadium"
              className="flex-1 min-w-0 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !venue.trim()}
              className="px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg shrink-0"
            >
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-red-600 dark:text-red-400"
            >
              {error}
            </motion.p>
          )}

          {results && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-10"
            >
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">
                Results ({results.length})
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((item, i) => (
                  <ResultCard key={i} data={item} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          {results && results.length === 0 && (
            <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
              No results for this venue.
            </p>
          )}
        </div>
      </motion.main>
    </div>
  );
}
