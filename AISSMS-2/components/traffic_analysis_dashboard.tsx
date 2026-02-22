"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface CityData {
  id: number;
  name: string;
  rank: number;
  congestion: number;
  change: number;
  timeLostInRushHours: number;
  lat: number;
  lng: number;
  optimalDistance: number;
  rushDistance: number;
  avgSpeed: number;
  congestionLevel: number;
  distanceIn15Min: number;
  highwayRatio: number;
}

const indianCities: CityData[] = [
  {
    id: 1,
    name: "Bengaluru",
    rank: 1,
    congestion: 74.4,
    change: 1.7,
    timeLostInRushHours: 168,
    lat: 12.9716,
    lng: 77.5946,
    optimalDistance: 7.1,
    rushDistance: 3.5,
    avgSpeed: 18.2,
    congestionLevel: 85.3,
    distanceIn15Min: 4.5,
    highwayRatio: 8.2,
  },
  {
    id: 2,
    name: "Pune",
    rank: 2,
    congestion: 71.1,
    change: 5.4,
    timeLostInRushHours: 152,
    lat: 18.5204,
    lng: 73.8567,
    optimalDistance: 7.6,
    rushDistance: 3.8,
    avgSpeed: 19.8,
    congestionLevel: 78.5,
    distanceIn15Min: 4.9,
    highwayRatio: 12.1,
  },
  {
    id: 3,
    name: "Mumbai",
    rank: 3,
    congestion: 63.2,
    change: -3.3,
    timeLostInRushHours: 126,
    lat: 19.076,
    lng: 72.8777,
    optimalDistance: 6.7,
    rushDistance: 3.6,
    avgSpeed: 18.5,
    congestionLevel: 82.7,
    distanceIn15Min: 4.6,
    highwayRatio: 30.8,
  },
  {
    id: 4,
    name: "New Delhi",
    rank: 4,
    congestion: 60.2,
    change: 3.5,
    timeLostInRushHours: 104,
    lat: 28.6139,
    lng: 77.209,
    optimalDistance: 7.5,
    rushDistance: 4.0,
    avgSpeed: 23.1,
    congestionLevel: 71.7,
    distanceIn15Min: 5.8,
    highwayRatio: 5.3,
  },
  {
    id: 5,
    name: "Kolkata",
    rank: 5,
    congestion: 58.9,
    change: 0.3,
    timeLostInRushHours: 150,
    lat: 22.5726,
    lng: 88.3639,
    optimalDistance: 6.7,
    rushDistance: 3.6,
    avgSpeed: 19.4,
    congestionLevel: 76.2,
    distanceIn15Min: 4.8,
    highwayRatio: 14.5,
  },
  {
    id: 6,
    name: "Jaipur",
    rank: 6,
    congestion: 58.7,
    change: 0.4,
    timeLostInRushHours: 121,
    lat: 26.9124,
    lng: 75.7873,
    optimalDistance: 8.1,
    rushDistance: 4.4,
    avgSpeed: 21.5,
    congestionLevel: 68.9,
    distanceIn15Min: 5.4,
    highwayRatio: 9.7,
  },
  {
    id: 7,
    name: "Chennai",
    rank: 7,
    congestion: 57.3,
    change: -1.2,
    timeLostInRushHours: 118,
    lat: 13.0827,
    lng: 80.2707,
    optimalDistance: 7.5,
    rushDistance: 4.0,
    avgSpeed: 20.8,
    congestionLevel: 70.4,
    distanceIn15Min: 5.2,
    highwayRatio: 16.3,
  },
  {
    id: 8,
    name: "Hyderabad",
    rank: 8,
    congestion: 56.1,
    change: -0.8,
    timeLostInRushHours: 115,
    lat: 17.385,
    lng: 78.4867,
    optimalDistance: 7.1,
    rushDistance: 4.0,
    avgSpeed: 21.2,
    congestionLevel: 69.5,
    distanceIn15Min: 5.3,
    highwayRatio: 11.8,
  },
  {
    id: 9,
    name: "Ernakulam",
    rank: 10,
    congestion: 52.4,
    change: 1.1,
    timeLostInRushHours: 108,
    lat: 9.9312,
    lng: 76.2673,
    optimalDistance: 7.6,
    rushDistance: 4.3,
    avgSpeed: 22.4,
    congestionLevel: 65.8,
    distanceIn15Min: 5.6,
    highwayRatio: 13.2,
  },
];

const TrafficAnalysisDashboard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [compareCity, setCompareCity] = useState<CityData | null>(null);
  const [view, setView] = useState<"map" | "table" | "compare">("map");

  const getColorByRank = (rank: number): string => {
    const colors = [
      "#16a34a", // Rank 1 - Green 600
      "#22c55e", // Rank 2 - Green 500
      "#4ade80", // Rank 3 - Green 400
      "#86efac", // Rank 4 - Green 300
      "#fbbf24", // Rank 5 - Amber 400
      "#f59e0b", // Rank 6 - Amber 500
      "#f97316", // Rank 7 - Orange 500
      "#ea580c", // Rank 8 - Orange 600
      "#dc2626", // Rank 9 - Red 600
      "#991b1b", // Rank 10 - Red 800
    ];
    return colors[rank - 1] || "#94a3b8";
  };

  const getRadius = (congestion: number): number => {
    return Math.max(15, Math.min(35, congestion / 2));
  };

  return (
    <div className="w-full bg-transparent overflow-hidden">
      {/* View Toggles */}
      <div className="flex justify-center mb-8 pt-4">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-inner">
          {[
            { id: "map", label: "Map View" },
            { id: "table", label: "Insights Table" },
            { id: "compare", label: "Comparison Mode" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setView(btn.id as any)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${view === btn.id
                ? "bg-white dark:bg-slate-900 text-green-600 shadow-md scale-[1.02]"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Map View */}
        {view === "map" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Map Container */}
            <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 h-[600px] relative z-0">
              {/* @ts-ignore */}
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                {/* @ts-ignore */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {indianCities.map((city) => (
                  /* @ts-ignore */
                  <CircleMarker
                    key={city.id}
                    center={[city.lat, city.lng]}
                    radius={getRadius(city.congestion)}
                    fillColor={getColorByRank(city.rank)}
                    color="#fff"
                    weight={2}
                    opacity={1}
                    fillOpacity={0.8}
                    eventHandlers={{
                      click: () => setSelectedCity(city),
                    }}
                  >
                    {/* @ts-ignore */}
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                      <div className="text-center p-1">
                        <div className="font-bold text-slate-900">{city.name}</div>
                        <div className="text-xs font-bold text-green-600">
                          {city.congestion}% congestion
                        </div>
                      </div>
                    </Tooltip>
                    <Popup>
                      <div className="p-3 min-w-[200px]">
                        <h3 className="font-black text-xl mb-3 text-slate-900 border-b pb-2">{city.name}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-400">Rank:</span>
                            <span className="text-green-600">#{city.rank}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-400">Congestion:</span>
                            <span>{city.congestion}%</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span className="text-slate-400">Trend:</span>
                            <span className={city.change > 0 ? "text-red-500" : "text-green-500"}>
                              {city.change > 0 ? "+" : ""}{city.change}pp
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>

            {/* City Rankings List */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 flex flex-col max-h-[600px]">
              <h2 className="text-xl font-black mb-6 text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-600 rounded-full" />
                City Rankings
              </h2>
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {indianCities.map((city, idx) => (
                  <motion.div
                    key={city.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedCity(city)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${selectedCity?.id === city.id
                      ? "bg-green-50 border-green-500 shadow-md"
                      : "bg-slate-50 hover:bg-white border-transparent hover:border-slate-200"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                        style={{ backgroundColor: getColorByRank(city.rank) }}
                      >
                        {city.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">
                          {city.name}
                        </div>
                        <div className="text-xs font-bold text-slate-400">
                          {city.congestion}% congestion
                        </div>
                      </div>
                      <div className={`text-sm font-black ${city.change > 0 ? "text-red-500" : "text-green-500"}`}>
                        {city.change > 0 ? "↑" : "↓"} {Math.abs(city.change)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Table View */}
        {view === "table" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Rank", "City", "Congestion", "Change", "Time Lost", "Avg Speed"].map((h) => (
                      <th key={h} className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {indianCities.map((city) => (
                    <tr
                      key={city.id}
                      className="hover:bg-green-50/30 cursor-pointer transition-colors group"
                      onClick={() => setSelectedCity(city)}
                    >
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: getColorByRank(city.rank) }}>
                          {city.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-green-600 transition-colors uppercase tracking-tight">{city.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-[100px]">
                            <div className="h-1.5 rounded-full" style={{ width: `${city.congestion}%`, backgroundColor: getColorByRank(city.rank) }} />
                          </div>
                          <span className="text-sm font-black">{city.congestion}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm">
                        <span className={city.change > 0 ? "text-red-500" : "text-green-500"}>
                          {city.change > 0 ? "↑" : "↓"}{Math.abs(city.change)}pp
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-500 text-sm">{city.timeLostInRushHours}h</td>
                      <td className="px-6 py-4 font-bold text-slate-500 text-sm">{city.avgSpeed} km/h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Compare View */}
        {view === "compare" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Main City", val: selectedCity, set: setSelectedCity },
                { label: "Comparison Target", val: compareCity, set: setCompareCity }
              ].map((select, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                    {select.label}
                  </label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-bold text-slate-900 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik02IDlsNiA2IDYtNiIvPjwvc3ZnPg==')] bg-[length:24px_24px] bg-[right_16px_center] bg-no-repeat"
                    value={select.val?.id || ""}
                    onChange={(e) => select.set(indianCities.find(c => c.id === Number(e.target.value)) || null)}
                  >
                    <option value="">Select a city...</option>
                    {indianCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {selectedCity && compareCity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
              >
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Metric</th>
                      <th className="px-8 py-6 text-center text-xl font-black text-slate-900 uppercase tracking-tight">{selectedCity.name}</th>
                      <th className="px-8 py-6 text-center text-xl font-black text-slate-900 uppercase tracking-tight">{compareCity.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-center">
                    {[
                      { label: "City Rank", key: "rank", type: "rank" },
                      { label: "Avg Congestion", key: "congestion", suffix: "%" },
                      { label: "Annual Rush Loss", key: "timeLostInRushHours", suffix: " Hours" },
                      { label: "Average Speed", key: "avgSpeed", suffix: " km/h" },
                      { label: "Network Connectivity", key: "highwayRatio", suffix: "%" }
                    ].map((row) => (
                      <tr key={row.key} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 text-left text-sm font-black text-slate-500 uppercase tracking-wide">{row.label}</td>
                        <td className="px-8 py-6">
                          {row.type === "rank" ? (
                            <span className="inline-flex w-12 h-12 items-center justify-center rounded-2xl text-white font-black shadow-lg" style={{ backgroundColor: getColorByRank(selectedCity.rank) }}>{selectedCity.rank}</span>
                          ) : (
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{(selectedCity as any)[row.key]}{row.suffix}</span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          {row.type === "rank" ? (
                            <span className="inline-flex w-12 h-12 items-center justify-center rounded-2xl text-white font-black shadow-lg" style={{ backgroundColor: getColorByRank(compareCity.rank) }}>{compareCity.rank}</span>
                          ) : (
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{(compareCity as any)[row.key]}{row.suffix}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        )}

        {/* Selected City Details Panel */}
        {selectedCity && view !== "compare" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 border border-slate-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl">
              <div className="w-80 h-80 bg-green-600 rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-8 mb-12">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl ring-8 ring-white"
                  style={{ backgroundColor: getColorByRank(selectedCity.rank) }}
                >
                  {selectedCity.rank}
                </div>
                <div>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-2 uppercase">
                    {selectedCity.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Metropolitan Traffic Profile</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Congestion", val: `${selectedCity.congestion}%`, change: selectedCity.change, sub: "Level" },
                  { label: "Speed", val: `${selectedCity.avgSpeed}`, sub: "km/h avg" },
                  { label: "Time Loss", val: `${selectedCity.timeLostInRushHours}`, sub: "Hours/Year" },
                  { label: "Connectivity", val: `${selectedCity.highwayRatio}%`, sub: "Highways" }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 group hover:border-green-200 transition-all duration-300">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</div>
                    <div className="text-4xl font-black text-slate-900 group-hover:text-green-600 transition-colors tracking-tighter">{stat.val}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-slate-500 tracking-tight">{stat.sub}</span>
                      {stat.change !== undefined && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.change > 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                          {stat.change > 0 ? "+" : ""}{stat.change}pp
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-12 border-t border-slate-100">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.2em] flex items-center gap-3">
                    <span className="w-8 h-1 bg-green-600 rounded-full" />
                    Infrastructure capability index
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                  {[
                    { label: "Optimal Flow Capacity", val: selectedCity.optimalDistance, color: "from-green-400 to-green-600" },
                    { label: "Peak Stress Resilience", val: selectedCity.rushDistance, color: "from-red-400 to-red-600" }
                  ].map((bar, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{bar.label}</span>
                        <span className="text-3xl font-black text-slate-900">{bar.val}<span className="text-xs font-bold text-slate-300 ml-1">km / 15min</span></span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-2xl overflow-hidden shadow-inner p-1">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(bar.val / 10) * 100}%` }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className={`h-full rounded-xl bg-gradient-to-r ${bar.color} shadow-lg shadow-green-500/10`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrafficAnalysisDashboard;
