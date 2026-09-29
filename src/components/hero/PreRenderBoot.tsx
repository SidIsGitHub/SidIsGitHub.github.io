"use client";

import { useEffect, useState } from "react";

const BOOT_LOGS = [
  "INIT_SYSTEM_KERNEL v4.1.2...",
  "MOUNTING ESP32_TELEMETRY_BRIDGE... [OK]",
  "STARTING FASTAPI_ENGINE (MEDIPANDA_AI)... [OK]",
  "CONNECTING SUPABASE_DB... [OK]",
  "INITIALIZING LANGCHAIN_RAG_PIPELINE... [OK]",
  "LOADING OPENCV_HAARCASCADES... [OK]",
  "SYNCING GOOGLE_SHEETS_INFRA... [OK]",
  "BYPASSING OPTICAL CONSTRAINTS...",
  "COMPILING ARCHITECTURAL PAYLOAD...",
  "WARNING: KINETIC_STRESS_DETECTED",
];

export function PreRenderBoot({ onComplete }: { onComplete: () => void }) {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    
    // High-speed spooling (40ms per line)
    const spoolInterval = setInterval(() => {
      if (currentIndex < BOOT_LOGS.length) {
        const currentLog = BOOT_LOGS[currentIndex];
        setVisibleLogs((prev) => [...prev, currentLog]);
        currentIndex++;
      } else {
        clearInterval(spoolInterval);
        
        // Trigger the fake crash
        setTimeout(() => {
          setCrashed(true);
          
          // Hold the crash screen for 150ms, then snap to the main site
          setTimeout(() => {
            onComplete();
          }, 150);
        }, 100);
      }
    }, 40);

    return () => clearInterval(spoolInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050505] text-[#EBEBEB] font-mono text-[11px] md:text-[13px] p-6 z-[9999] flex flex-col justify-end pb-12 overflow-hidden pointer-events-auto">
      <div className="flex flex-col gap-1">
        {visibleLogs.map((log, i) => {
          if (!log) return null;
          return (
            <span key={i} className="tracking-widest">
              {log.includes("WARNING") ? (
                <span className="text-[#FFED00]">{log}</span>
              ) : (
                `> ${log}`
              )}
            </span>
          );
        })}
        
        {crashed && (
          <span className="text-[#D41111] font-bold tracking-widest mt-2 bg-[#D41111]/20 p-1 w-fit">
            &gt; ERR: FATAL_UI_OVERRIDE. FORCING PHYSICAL RENDER...
          </span>
        )}
        
        {/* Blinking block cursor */}
        {!crashed && <span className="w-3 h-4 bg-[#EBEBEB] animate-pulse mt-1 inline-block" />}
      </div>
    </div>
  );
}
