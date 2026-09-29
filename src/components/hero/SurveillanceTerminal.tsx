import { useEffect, useState, useRef } from "react";
import { useMotionValueEvent, MotionValue, motion } from "framer-motion";

const MOCK_LOGS = [
  "> Fetching schema...",
  "> Translating achievements into corporate language...",
  "> Exaggerating character metrics...",
  "> ERR: CONTEXT_OVERLOAD",
  "> Bypassing optical constraints...",
  "> Compiling architectural payload...",
  "> SYNC: 2026-09_LOCAL",
  "> AWAITING_INPUT..."
];

export function SurveillanceTerminal({ 
  mouseX, 
  mouseY, 
  scrollYProgress 
}: { 
  mouseX: MotionValue<number>; 
  mouseY: MotionValue<number>; 
  scrollYProgress: MotionValue<number>;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const coordRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLSpanElement>(null);

  // 1. Asynchronous Fake Network Spooler
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = MOCK_LOGS[Math.floor(Math.random() * MOCK_LOGS.length)];
        const updated = [...prev, newLog];
        return updated.slice(-6); // Keep only the last 6 lines
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // 1.5 Chaotic Teleportation Engine (Locked to 64px Grid)
  const [glitchState, setGlitchState] = useState({ x: 64, y: 64, opacity: 1, scale: 1, filter: "none" });

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const rand = Math.random();
      
      // REDUCED FREQUENCY: Jump logic now requires a 90% threshold instead of 85%
      if (rand > 0.90) {
        // Calculate bounds so the 300px box doesn't jump off-screen
        const maxX = typeof window !== 'undefined' ? window.innerWidth - 320 : 1000;
        const maxY = typeof window !== 'undefined' ? window.innerHeight - 200 : 800;

        // FULL SCREEN JUMP (Snapped to 64px grid)
        setGlitchState({
          x: Math.floor(Math.random() * (maxX / 64)) * 64,
          y: Math.floor(Math.random() * (maxY / 64)) * 64,
          opacity: Math.random() > 0.5 ? 1 : 0.6,
          scale: 1, // Remove sub-pixel scaling to keep grid alignment tight
          filter: Math.random() > 0.8 ? "invert(100%)" : "none"
        });
      } else if (rand > 0.85) {
        // MICRO JITTER: Vibrate near its current location
        setGlitchState(prev => ({
          ...prev,
          x: prev.x + (Math.random() - 0.5) * 40,
          y: prev.y + (Math.random() - 0.5) * 40,
          opacity: 1,
          scale: 1,
          filter: "none"
        }));
      }
    }, 100);

    return () => clearInterval(glitchInterval);
  }, []);

  // 2. Direct DOM Telemetry Updates (Bypassing React State)
  useMotionValueEvent(mouseX, "change", (latestX) => {
    if (coordRef.current) {
      coordRef.current.innerText = `[X:${Math.round(latestX)} Y:${Math.round(mouseY.get())}]`;
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (latestScroll) => {
    if (scrollRef.current) {
      scrollRef.current.innerText = `DEPTH: ${(latestScroll * 100).toFixed(2)}%`;
    }
  });

  return (
    <motion.div 
      // Changed to fixed top-0 left-0, width increased, text size increased to 11px
      className="fixed top-0 left-0 w-[300px] bg-black text-[#EBEBEB] p-4 font-mono text-[11px] leading-relaxed z-50 pointer-events-none border border-[#D41111]"
      animate={glitchState}
      transition={{ duration: 0 }} // Instant snapping
      style={{ 
        willChange: "transform, opacity, filter" // Shadow removed entirely
      }}
    >
      
      {/* Clean Header: TERMINAL only */}
      <div className="border-b border-[#D41111] pb-1 mb-3 text-[#FFED00] font-bold text-sm tracking-wider">
        <span>TERMINAL</span>
      </div>
      
      {/* High-Frequency Data with better padding */}
      <div className="flex flex-col gap-1 text-[#00B4D8] mb-3 font-bold tracking-widest bg-[#111] p-2">
        <span ref={coordRef}>[X:0 Y:0]</span>
        <span ref={scrollRef}>DEPTH: 0.00%</span>
      </div>

      {/* Asynchronous Logs with increased line height/gaps */}
      <div className="flex flex-col text-[#a1a1aa] gap-1">
        {logs.map((log, i) => (
          <span key={i} className={log.includes("ERR") ? "text-[#FFED00] bg-[#D41111] px-1 font-bold" : ""}>
            {log}
          </span>
        ))}
        <span className="w-2 h-3 bg-[#EBEBEB] animate-pulse mt-2" />
      </div>
      
    </motion.div>
  );
}
