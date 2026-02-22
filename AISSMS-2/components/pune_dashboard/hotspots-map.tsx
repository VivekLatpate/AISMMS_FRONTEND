"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Hotspot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: "high" | "medium" | "low";
  note: string;
}

const hotspots: Hotspot[] = [
  {
    id: "shivajinagar",
    name: "Shivajinagar",
    lat: 18.5302,
    lng: 73.8478,
    severity: "high",
    note: "Bus terminal spillover + narrow merges",
  },
  {
    id: "swargate",
    name: "Swargate",
    lat: 18.5018,
    lng: 73.8636,
    severity: "high",
    note: "Interchange + pedestrian crossings",
  },
  {
    id: "hinjewadi",
    name: "Hinjewadi",
    lat: 18.5986,
    lng: 73.7366,
    severity: "high",
    note: "IT peak wave + construction bottlenecks",
  },
  {
    id: "wakad",
    name: "Wakad",
    lat: 18.5997,
    lng: 73.7645,
    severity: "medium",
    note: "Expressway feeder queues",
  },
  {
    id: "hadapsar",
    name: "Hadapsar",
    lat: 18.5089,
    lng: 73.926,
    severity: "medium",
    note: "Freight + market activity",
  },
  {
    id: "kothrud",
    name: "Kothrud",
    lat: 18.5074,
    lng: 73.8077,
    severity: "low",
    note: "Signal coordination drift on arterials",
  },
];

function colorFor(severity: Hotspot["severity"]) {
  if (severity === "high") return "#fb923c"; // orange-400
  if (severity === "medium") return "#34d399"; // emerald-400
  return "#a7f3d0"; // emerald-200
}

function radiusFor(severity: Hotspot["severity"]) {
  if (severity === "high") return 18;
  if (severity === "medium") return 14;
  return 10;
}

function MapController({ selectedHotspot }: { selectedHotspot: Hotspot | null }) {
  const map = useMap();
  React.useEffect(() => {
    if (selectedHotspot) {
      map.flyTo([selectedHotspot.lat, selectedHotspot.lng], 14, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [selectedHotspot, map]);
  return null;
}

export function PuneHotspotsMap() {
  const [selectedHotspot, setSelectedHotspot] = React.useState<Hotspot | null>(null);

  const puneCenter: [number, number] = [18.5204, 73.8567];

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-[0_18px_45px_rgba(15,23,42,0.6)]"
    >
      <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Congestion hot spots
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Pune core + IT corridor heat nodes (sample data)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            High
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Medium
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-200" />
            Low
          </span>
        </div>
      </header>

      <div className="h-[420px] w-full cursor-crosshair">
        {/* @ts-ignore */}
        <MapContainer
          center={puneCenter}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          {/* @ts-ignore */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController selectedHotspot={selectedHotspot} />
          {hotspots.map((hotspot) => (
            /* @ts-ignore */
            <CircleMarker
              key={hotspot.id}
              center={[hotspot.lat, hotspot.lng] as any} // Keep as any for center prop type mismatch
              radius={radiusFor(hotspot.severity)}
              fillColor={colorFor(hotspot.severity)}
              color="#0f172a"
              weight={2}
              opacity={1}
              fillOpacity={0.75}
              eventHandlers={{
                click: () => setSelectedHotspot(hotspot),
              }}
            >
              {/* @ts-ignore */}
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                <div className="text-center p-1">
                  <div className="font-bold text-slate-900">{hotspot.name}</div>
                  <div className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{hotspot.severity} priority</div>
                  <div className="text-xs mt-1 text-slate-500 italic">{hotspot.note}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </motion.section>
  );
}

