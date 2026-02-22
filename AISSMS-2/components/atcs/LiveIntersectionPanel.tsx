"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Info } from "lucide-react";

const approaches = [
   { id: "east", dir: "East", queue: 18, inflow: "+32%", load: "Low", priority: 0.78, trend: "up" },
   { id: "north", dir: "North", queue: 9, inflow: "+12%", load: "Medium", priority: 0.42, trend: "up" },
   { id: "south", dir: "South", queue: 6, inflow: "+5%", load: "Low", priority: 0.30, trend: "down" },
   { id: "west", dir: "West", queue: 11, inflow: "+18%", load: "High", priority: 0.51, trend: "up" },
];

const containerVariants: Variants = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.05,
      },
   },
};

const itemVariants: Variants = {
   hidden: { opacity: 0, y: 10 },
   visible: {
      opacity: 1,
      y: 0,
      transition: {
         type: "spring",
         stiffness: 300,
         damping: 30
      }
   } as any, // Cast to avoid complex Transition type issues in simple Variants
};

export default function LiveIntersectionPanel() {
   const [selectedId, setSelectedId] = React.useState<string | null>(null);

   return (
      <div className="space-y-6 relative">
         <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
         >
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 border-b-2 border-orange-500 pb-1 flex items-center gap-2">
               Intersection Telemetry <span className="text-gray-400 font-bold ml-2">#WAKAD-04</span>
            </h3>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
               Live Stream Processing
            </div>
         </motion.div>

         <div className="relative min-h-[400px]">
            <AnimatePresence mode="popLayout">
               {!selectedId ? (
                  <motion.div
                     key="grid"
                     variants={containerVariants}
                     initial="hidden"
                     animate="visible"
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                     {approaches.map((app) => (
                        <motion.div
                           key={app.id}
                           layoutId={app.id}
                           variants={itemVariants}
                           onClick={() => setSelectedId(app.id)}
                           className="cursor-pointer bg-white border border-gray-100 p-5 rounded-sm shadow-sm hover:shadow-md transition-all group active:scale-[0.98]"
                        >
                           <div className="flex justify-between items-start mb-4">
                              <span className="text-xl font-black text-gray-950 tracking-tighter uppercase">{app.dir}</span>
                              <div className={`p-1.5 rounded-sm ${app.trend === "up" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                                 {app.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              </div>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Queue</span>
                                 <span className="text-2xl font-black text-gray-900">{app.queue}</span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Inflow</span>
                                 <span className={`text-lg font-black ${app.trend === "up" ? "text-orange-600" : "text-green-600"}`}>{app.inflow}</span>
                              </div>
                           </div>

                           <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-black text-gray-400 uppercase">Load</span>
                                 <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${app.load === "High" ? "bg-red-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                                    {app.load}
                                 </span>
                              </div>
                              <div className="flex flex-col items-end">
                                 <span className="text-[9px] font-black text-gray-400 uppercase">Priority</span>
                                 <span className="text-xs font-black text-gray-900">{app.priority.toFixed(2)}</span>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </motion.div>
               ) : (
                  <motion.div
                     key="detail"
                     layoutId={selectedId}
                     className="bg-white border border-gray-200 p-8 rounded-sm shadow-xl relative z-20"
                  >
                     <button
                        onClick={() => setSelectedId(null)}
                        className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                     >
                        Close [Esc]
                     </button>

                     <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex-1 space-y-6">
                           <div>
                              <span className="text-xs font-black text-orange-600 uppercase tracking-[0.3em]">Direct Analytics</span>
                              <h2 className="text-5xl font-black text-gray-950 tracking-tighter uppercase mt-2">
                                 {approaches.find(a => a.id === selectedId)?.dir} Approach
                              </h2>
                           </div>

                           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-gray-100">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-gray-400 uppercase mb-1">Current Queue</span>
                                 <span className="text-4xl font-black text-gray-900">{approaches.find(a => a.id === selectedId)?.queue} <span className="text-xs text-gray-400">VEH</span></span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-gray-400 uppercase mb-1">Flow Rate</span>
                                 <span className="text-4xl font-black text-orange-600 uppercase">{approaches.find(a => a.id === selectedId)?.inflow}</span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-gray-400 uppercase mb-1">Pressure Index</span>
                                 <span className="text-4xl font-black text-gray-900">{approaches.find(a => a.id === selectedId)?.priority.toFixed(2)}</span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-gray-400 uppercase mb-1">System Load</span>
                                 <span className="text-4xl font-black text-gray-900 uppercase">NOMINAL</span>
                              </div>
                           </div>

                           <div className="bg-gray-50 p-4 rounded-sm">
                              <p className="text-sm font-medium text-gray-600">
                                 Real-time CV2X telemetry suggests an increase in heavy-vehicle clusters approaching from the 500m perimeter. Predictive adjustments are being calculated...
                              </p>
                           </div>
                        </div>

                        <div className="w-full md:w-64 space-y-4">
                           <div className="h-40 bg-gray-100 rounded-sm flex items-center justify-center border-2 border-dashed border-gray-200">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Feed Integration</span>
                           </div>
                           <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase">
                              <span>CAM_ID: WAK4_E</span>
                              <span>STATUS: ENCRYPTED</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Decision Summary */}
         <motion.div
            layout
            className="bg-gray-950 p-6 rounded-sm text-white flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-orange-600"
         >
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Optimization Decision</h4>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Selected Phase</span>
                     <span className="text-2xl font-black text-white uppercase tracking-tighter">East-West Main Flow</span>
                  </div>
                  <div>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">Green Allocation</span>
                     <span className="text-2xl font-black text-orange-500 tracking-tighter">45s <span className="text-xs text-gray-600 font-bold ml-1">+12s Extension</span></span>
                  </div>
                  <div className="flex items-start gap-3">
                     <div className="mt-1"><Info className="w-4 h-4 text-orange-600" /></div>
                     <p className="text-xs font-medium text-gray-400 leading-normal">
                        <span className="font-black text-white uppercase">Reason:</span> Highest pressure score detected on East approach combined with predicted influx from Hinjewadi Ph-1 office exits.
                     </p>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
   );
}
