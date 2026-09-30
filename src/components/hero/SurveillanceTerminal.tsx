import { useEffect, useState } from "react";

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

export function SurveillanceTerminal() {
  const [logs, setLogs] = useState<string[]>([]);

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

  return (
    <div 
      className="fixed top-4 left-4 w-[300px] bg-black text-[#EBEBEB] p-4 font-mono text-[11px] leading-relaxed z-50 pointer-events-none border border-[#D41111]"
    >
      {/* Clean Header: TERMINAL only */}
      <div className="border-b border-[#D41111] pb-1 mb-3 text-[#FFED00] font-bold text-sm tracking-wider">
        <span>TERMINAL</span>
      </div>
      
      {/* High-Frequency Data with better padding */}
      <div className="flex flex-col gap-1 text-[#00B4D8] mb-3 font-bold tracking-widest bg-[#111] p-2">
        <span>[X:0 Y:0]</span>
        <span>DEPTH: 0.00%</span>
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
      
    </div>
  );
}
