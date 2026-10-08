"use client";

import { motion, useAnimationFrame, useMotionValue, MotionValue } from "framer-motion";

export default function CodeUnderworld({ 
  activeZone, 
  rawCode, 
  speedMultiplier 
}: { 
  activeZone?: string, 
  rawCode: string, 
  speedMultiplier?: MotionValue<number> 
}) {
  const codeString = rawCode || "SYSTEM_BOOT...";
  
  // Flatten the string (remove explicit line breaks) and add spacing
  const continuousCode = codeString.replace(/\n/g, '   ');
  
  // Multiply it massively to ensure a full edge-to-edge matrix
  const massiveCode = continuousCode.repeat(100);

  // Strict regex pipeline: Escape HTML first, then colorize.
  const formatCode = (codeStr: string) => {
    let html = codeStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    html = html
      // Strings & Keywords (Cyan)
      .replace(/(["'`].*?["'`])/g, '<span style="color:#1FA3A3;">$1</span>')
      .replace(/\b(export|default|function|return|const|let|var|import|from|useMotionValue|useVelocity)\b/g, '<span style="color:#1FA3A3; font-weight:bold;">$1</span>')
      // React Components & Numbers (Red)
      .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span style="color:#C21807; font-weight:bold;">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#C21807;">$1</span>')
      // Comments (Dim)
      .replace(/(\/\/.*)/g, '<span style="color:#6B7280; font-style:italic;">$1</span>');
      
    return html;
  };

  const tesseractRotation = useMotionValue(0);

  useAnimationFrame((time, delta) => {
    // Default multiplier is 1 if not provided. Spikes up to 4 during heavy CD spin.
    const currentSpeed = speedMultiplier ? speedMultiplier.get() : 1; 
    
    // Rotate base speed * the kinetic spike
    tesseractRotation.set(tesseractRotation.get() + (delta * 0.05 * currentSpeed));
  });

  return (
    <div className="fixed inset-0 z-0 w-screen h-screen bg-[#050505] overflow-hidden pointer-events-none hidden md:flex items-center justify-center">
      {/* THE UNIFIED KINETIC TESSERACT */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 z-0">
        <motion.div style={{ rotateX: tesseractRotation, rotateY: tesseractRotation }} className="relative w-[60vw] h-[60vw] md:w-96 md:h-96 [transform-style:preserve-3d]">
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
             <rect x="25" y="25" width="50" height="50" fill="none" stroke="#D41111" strokeWidth="2" />
             <rect x="10" y="10" width="80" height="80" fill="none" stroke="#D41111" strokeWidth="2" />
             {/* Connecting lines */}
             <line x1="10" y1="10" x2="25" y2="25" stroke="#D41111" strokeWidth="2" />
             <line x1="90" y1="10" x2="75" y2="25" stroke="#D41111" strokeWidth="2" />
             <line x1="10" y1="90" x2="25" y2="75" stroke="#D41111" strokeWidth="2" />
             <line x1="90" y1="90" x2="75" y2="75" stroke="#D41111" strokeWidth="2" />
          </svg>
        </motion.div>
      </div>

      <pre 
        className="absolute inset-0 w-[105vw] h-[105vh] -translate-x-2 -translate-y-2 font-mono text-[0.8rem] md:text-[1.05rem] leading-[1.7] tracking-tight text-white break-all whitespace-normal text-justify opacity-85 z-10"
        dangerouslySetInnerHTML={{ __html: formatCode(massiveCode) }}
      />
    </div>
  );
}
