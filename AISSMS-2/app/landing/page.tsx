"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/navbar";
import USPSection from "@/components/usp";
import AboutPage from "@/components/gaps";
import AboutSection from "@/components/about_us";

const TrafficAnalysisDashboard = dynamic(
  () => import("@/components/traffic_analysis_dashboard"),
  { ssr: false }
);

export default function IndianTrafficControl() {
  return (
    <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center px-6 lg:px-16 py-20 relative overflow-hidden bg-[#f7f8fa]">

        {/* Right background – neutral grey like reference */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[60%] bg-gradient-to-l from-[#e5e6e8] via-[#f1f2f4] to-transparent pointer-events-none z-0" />

        {/* Background video */}
        <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f8fa] via-[#f7f8fa]/70 to-transparent z-10" />
          <video
            src="/intovehivle.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-20">
          {/* LEFT: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                AI Traffic Coordination Platform
              </motion.div>

              {/* Brand-style headline */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] text-slate-900 tracking-tight">
                Smarter cities.
                <br />
                <span className="text-green-600">Smoother mobility.</span>
              </h1>

              {/* Product-grade sub-text */}
              <p className="text-base lg:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                An AI-driven traffic coordination platform that continuously optimizes
                signal networks across Indian cities to reduce congestion, delays and
                operational inefficiencies in real time.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 16px 36px -10px rgba(22, 163, 74, 0.28)" }}
                whileTap={{ scale: 0.96 }}
                className="px-10 py-5 bg-green-600 text-white font-bold rounded-2xl text-sm shadow-xl hover:bg-green-700 transition-all duration-300 uppercase tracking-widest"
              >
                Launch Dashboard
              </motion.button>

              <button className="px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl text-sm shadow-lg border border-slate-100 hover:bg-slate-50 transition-all uppercase tracking-widest">
                Watch Demo
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-200/60 max-w-lg">
              {[
                { value: "1.2k+", label: "Signalized junctions connected", color: "text-green-600" },
                { value: "4 ms", label: "Model inference latency", color: "text-blue-600" },
                { value: "32%", label: "Average delay reduction", color: "text-orange-500" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className={`text-2xl font-black ${stat.color} tracking-tight`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-30 bg-white">
        <AboutSection />
        <AboutPage />
        <USPSection />

        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-150px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="py-32 px-6 bg-slate-50 border-t border-slate-200/50"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
                National traffic data layer
              </div>

              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
                City-scale traffic intelligence
              </h2>

              <p className="text-base lg:text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                Unified analytics and performance monitoring across major urban
                corridors and signal networks.
              </p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] p-4 lg:p-8 border border-white">
              <TrafficAnalysisDashboard />
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}