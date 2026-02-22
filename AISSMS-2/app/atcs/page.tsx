"use client";

import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Globe, ShieldCheck, Info } from "lucide-react";

// Dashboard Components
import TopStatusBar from "@/components/atcs/TopStatusBar";
import LiveIntersectionPanel from "@/components/atcs/LiveIntersectionPanel";
import DataFusionPanel from "@/components/atcs/DataFusionPanel";
import HybridDecisionBreakdown from "@/components/atcs/HybridDecisionBreakdown";
import EdgeCaseMonitor from "@/components/atcs/EdgeCaseMonitor";
import PerformanceImpact from "@/components/atcs/PerformanceImpact";

export default function ATCSDashboard() {
   return (
      <main className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">

         {/* --- LEVEL 1: CORPORATE HEADER --- */}
         <header className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-[110] shadow-sm">
            <div className="max-w-[1700px] mx-auto flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                     <h1 className="text-xl font-black tracking-tighter flex items-center gap-2">
                        PUNE<span className="text-orange-600">SMART</span>CITY
                        <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-sm tracking-widest ml-1 uppercase">ICCC-CORE</span>
                     </h1>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Adaptive Traffic Control Intelligence Unit</p>
                  </div>
                  <div className="h-8 w-px bg-gray-100 hidden md:block" />
                  <div className="hidden md:flex items-center gap-2 text-green-600">
                     <ShieldCheck className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Live Engine Active</span>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="hidden xl:flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-sm border border-gray-100 mr-4">
                     <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-gray-400 uppercase leading-none">Global Network Load</span>
                        <span className="text-xs font-black text-gray-900 tracking-tighter">14.2% (Nominal)</span>
                     </div>
                     <div className="w-12 h-1 bg-green-500 rounded-full" />
                  </div>
                  <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-sm hover:bg-gray-50 transition-colors shadow-sm">
                     <Globe className="w-4 h-4 text-gray-400" />
                     <span className="text-[10px] font-black uppercase tracking-widest">System Map</span>
                  </button>
                  <button className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-sm shadow-md shadow-orange-100 hover:bg-orange-700 transition-all">
                     <LayoutDashboard className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">Control Board</span>
                  </button>
               </div>
            </div>
         </header>

         {/* --- LEVEL 2: SYSTEM STATUS BAR --- */}
         <TopStatusBar />

         {/* --- LEVEL 3: DASHBOARD WORKSPACE --- */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-[1700px] mx-auto p-8 space-y-8"
         >

            {/* ROW 1: CORE TELEMETRY & IMPACT */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               {/* Primary Telemetry (Main Control Panel) */}
               <div className="lg:col-span-3">
                  <LiveIntersectionPanel />
               </div>

               {/* Performance Benchmarks */}
               <div className="lg:col-span-1">
                  <PerformanceImpact />
               </div>
            </div>

            {/* ROW 2: INTELLIGENCE REASONING */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
               {/* Intelligence Layers */}
               <div className="xl:col-span-1">
                  <DataFusionPanel />
               </div>
               <div className="xl:col-span-2">
                  <HybridDecisionBreakdown />
               </div>
               <div className="xl:col-span-1 text-black">
                  <EdgeCaseMonitor />
               </div>
            </div>

            {/* FOOTNOTE / TECHNICAL META */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500" />
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Edge-Sync Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-orange-500" />
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Predictive Bias Enabled</span>
                  </div>
               </div>
               <div className="flex items-center gap-3 bg-white px-4 py-2 border border-gray-100 rounded-sm">
                  <Info className="w-4 h-4 text-gray-300" />
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                     Calculated using Hybrid MARL v4.2.8 Deployment Hinjewadi-01
                  </p>
               </div>
            </div>
         </motion.div>

      </main>
   );
}
