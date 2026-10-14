"use client";
import React from "react";
import { motion } from "framer-motion";

export default function SterileIdentity() {
  return (
    <section 
      className="relative w-full min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center py-32 overflow-hidden z-50"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}
    >
      
      {/* MASSIVE TYPOGRAPHY */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-[#1D1D1F] uppercase mb-12"
      >
        About Me
      </motion.h2>

      {/* THE TARGET: CORPORATE PORTRAIT */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative w-[85vw] md:w-[45vw] max-w-[600px] aspect-square mb-8 flex items-center justify-center z-10"
      >
        <img 
          src="/headshot.png" 
          alt="Siddhant Bansod" 
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* CLINICAL TELEMETRY BIO */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col items-center gap-3 font-mono text-xs md:text-sm text-[#86868B] tracking-widest uppercase text-center px-6 mt-4"
      >
        <p><span className="text-[#1D1D1F] font-bold">SYS.ARCH:</span> Full-Stack &amp; Machine Learning</p>
        <p><span className="text-[#1D1D1F] font-bold">HARDWARE:</span> Physical Telemetry &amp; Autonomous Networks</p>
        <p><span className="text-[#1D1D1F] font-bold">OBJECTIVE:</span> Zero-Latency Execution &amp; Structural Efficiency</p>
      </motion.div>

    </section>
  );
}
