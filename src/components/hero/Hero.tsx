"use client";

import { useState, useEffect, useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent, useVelocity, useSpring, useMotionTemplate, motion, useMotionValue, MotionValue } from "framer-motion";
import ChaosLayer from "./ChaosLayer";
import CodeUnderworld from "./CodeUnderworld";
import CursorMask from "./CursorMask";
import YeezusDisc from "@/components/disc/YeezusDisc";
import { CipherText } from "./CipherText";
import { SubliminalFlashes } from "./SubliminalFlashes";
import { PreRenderBoot } from "./PreRenderBoot";

/**
 * HERO — THE ORCHESTRATOR
 *
 * Architecture:
 * 1. ChaosLayer (z-10)  — The hostile surface. Always visible.
 * 2. CursorMask (z-20)  — Wraps DivineLayer, clips it to cursor circle.
 *    └─ DivineLayer      — The beautiful truth. Only visible through mask.
 * 3. YeezusDisc (z-30)  — R3F Canvas, floats above everything.
 *
 * The user sees chaos. They move their cursor. The chaos dissolves
 * under the cursor to reveal the engineering truth beneath.
 * Meanwhile, the disc spins with scroll velocity.
 *
 * This is the visual metaphor: a chaotic mind with divine engineering inside.
 */

interface HeroProps {
  rawCode: string;
}



export const PROJECT_REGISTRY = {
  fluxx: {
    id: "FLUXX_SYS",
    stack: "ESP32_TELEMETRY // SOLIDWORKS // OPENCV",
    status: "DEPLOYED",
    code: `import cv2\nimport numpy as np\nfrom esp32_bridge import Telemetry\n\ndef analyze_air_quality(frame):\n  # LangChain RAG integration\n  heatmap = cv2.applyColorMap(frame, cv2.COLORMAP_JET)\n  return heatmap`
  },
  medipanda: {
    id: "MEDIPANDA_AI",
    stack: "FASTAPI // SUPABASE // RAG_ARCHITECTURE",
    status: "ACTIVE",
    code: `@app.post("/api/v1/analyze-report")\nasync def process_ocr(image: UploadFile = File(...)):\n  # Dr. Paws Context Engine\n  raw_text = await extract_text(image)\n  structured_data = gemini_vision.parse(raw_text)\n  return supabase.table("records").insert(structured_data)`
  },
  lounge: {
    id: "LOUNGE_INFRA",
    stack: "FLUTTER // GOOGLE_SHEETS_SYNC // TIME_SLOTS",
    status: "SYNCED",
    code: `Future<void> bookSlot(int duration, String userId) async {\n  final wallet = await getCoins(userId);\n  if (wallet < cost) throw Error('INSUFFICIENT_FUNDS');\n  await sheetsApi.updateCell(range, 'BOOKED');\n  // INITIALIZE COMBO MENU ROUTING...\n}`
  }
};

export const PROJECT_KEYS = Object.keys(PROJECT_REGISTRY);

export default function Hero({ rawCode }: HeroProps) {
  const [activeZone, setActiveZone] = useState("surface");

  // Scroll mapping logic
  const { scrollYProgress, scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  // Magnetic Repulsion Physics Engine
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);


  // ADD TO TOP OF HERO COMPONENT
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, { damping: 40, stiffness: 300 });
  const spinVelocity = useVelocity(rotation);
  const newSmoothVelocity = useSpring(spinVelocity, { damping: 20, stiffness: 400 });

  // 1. Z-Axis Camera (Negative rotation does nothing, Clockwise drills)
  const textZScale = useTransform(smoothRotation, [-360, 0, 90], [1, 1, 20]);
  const textBlur = useTransform(smoothRotation, [-360, 0, 50, 90], ["blur(0px)", "blur(0px)", "blur(4px)", "blur(25px)"]);
  const elementOpacity = useTransform(smoothRotation, [-360, 0, 70, 90], [1, 1, 0.8, 0]); 

  // Kinetic Aberration Engine
  const rgbShadow = useTransform(
    newSmoothVelocity,
    [-800, 0, 800],
    [
      "-8px 0px 0px rgba(212,17,17,0.8), 8px 0px 0px rgba(0,255,255,0.8)",
      "0px 0px 0px rgba(212,17,17,0), 0px 0px 0px rgba(0,255,255,0)",
      "8px 0px 0px rgba(212,17,17,0.8), -8px 0px 0px rgba(0,255,255,0.8)"
    ]
  );
  const shear = useTransform(newSmoothVelocity, [-800, 0, 800], [-8, 0, 8]);
  const jitter = useTransform(newSmoothVelocity, [-800, 0, 800], [-15, 0, 15]);
  const inverseJitter = useTransform(jitter, (val) => val * -0.5);

  // We need the absolute magnitude of the combined velocity (scrolling or CD scratching) for the subliminal flashes
  const velocityMagnitude = useTransform(
    [smoothRotation, spinVelocity],
    ([sv, rv]) => Math.max(Math.abs(sv as number), Math.abs((rv as number) * 15))
  );

  // 6. Tesseract Kinetic Spike (1x normal speed, 4x under heavy RPM)
  const tesseractSpike = useTransform(smoothVelocity, [-800, 0, 800], [4, 1, 4]);

  // 2. Premium Clean Room Snap (Triggers ONLY at +90)
  const brutalistOpacity = useTransform(smoothRotation, [-360, 0, 89.9, 90], [1, 1, 1, 0]);
  const cleanRoomOpacity = useTransform(smoothRotation, [-360, 0, 89.9, 90], [0, 0, 0, 1]);



  // The Mechanical Snap (Visual Rotation)
  // While the user drags to 90, the image rotates 1:1. 
  // At exactly 90, the graphic violently snaps backwards to 75 degrees and locks.
  const visualCdRotation = useTransform(smoothRotation, [-360, 0, 89.9, 90, 91], [-360, 0, 89.9, 75, 75]);

  const [activeProjectKey, setActiveProjectKey] = useState<keyof typeof PROJECT_REGISTRY>("fluxx");
  const [isDragging, setIsDragging] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const [hasFlashed, setHasFlashed] = useState(false);

  // Listens to the raw rotation. The moment it crosses 89, it triggers the flash state.
  useMotionValueEvent(rotation, "change", (latest) => {
    if (latest >= 89 && !hasFlashed) {
      setHasFlashed(true);
    } else if (latest < 80 && hasFlashed) {
      // Resets the flashbang if the user spins the CD back to the start
      setHasFlashed(false); 
    }
  });

  useMotionValueEvent(rotation, "change", (latest) => {
    // Normalize rotation to a clean 0-360 loop
    let normalized = Math.round(latest % 360);
    if (normalized < 0) normalized += 360;

    // Map degrees to mechanical sectors
    if (normalized >= 0 && normalized < 120) {
      if (activeProjectKey !== "fluxx") setActiveProjectKey("fluxx");
    } else if (normalized >= 120 && normalized < 240) {
      if (activeProjectKey !== "medipanda") setActiveProjectKey("medipanda");
    } else if (normalized >= 240 && normalized < 360) {
      if (activeProjectKey !== "lounge") setActiveProjectKey("lounge");
    }
  });

  const activeProject = PROJECT_REGISTRY[activeProjectKey];



  if (!hasBooted) {
    return <PreRenderBoot onComplete={() => setHasBooted(true)} />;
  }

  return (
    <motion.main
      id="hero"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "300vh" }} // Extra height for scroll-driven disc rotation
    >
      {/* Sticky container — keeps the visual viewport locked while scrolling drives physics */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* The Subliminal Engine - Passes the absolute magnitude of the scroll velocity */}
        <SubliminalFlashes velocity={velocityMagnitude} />

        {/* Layer 1: CODE UNDERWORLD (STATIC BACKGROUND) */}
        <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ opacity: brutalistOpacity }}>
          <CodeUnderworld speedMultiplier={tesseractSpike} activeZone={activeZone} rawCode={activeProject.code} />
        </motion.div>


        {/* Layer 2: TEAR MASK WRAPPING THE ENTIRE UI */}
        <motion.div className="absolute inset-0 z-20" style={{ opacity: brutalistOpacity }}>
          <CursorMask scrollYProgress={scrollYProgress}>
            {/* CHAOS LAYER (Black Background) */}
            <div className="absolute inset-0 pointer-events-auto" onMouseEnter={() => setActiveZone("surface")}>
              <ChaosLayer />
            </div>

            {/* 3. The Typography (z-0) - Sits flat on the background */}
            {/* ONLY UPDATE THIS SPECIFIC WRAPPER AND ITS HEADINGS */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-start pt-[12vh] z-20 origin-center pointer-events-none"
              style={{ 
                scale: textZScale,
                filter: textBlur,
                opacity: elementOpacity,
                skewX: shear, 
                x: jitter     
              }}
            >
              <motion.h1 
                className="text-[17vw] font-black leading-[0.75] uppercase text-center text-[#050505] mix-blend-multiply"
                style={{ textShadow: rgbShadow }} 
              >
                SIDDHANT
              </motion.h1>
              <motion.h2 
                className="text-[3.5vw] font-black leading-none tracking-widest uppercase mt-4 text-[#8a0303] mix-blend-multiply opacity-90"
                style={{ textShadow: rgbShadow, x: inverseJitter }}
              >
                REPEL MEDIOCRITY
              </motion.h2>
            </motion.div>
          </CursorMask>
        </motion.div>

        {/* INJECT THIS NEW LAYER TO FADE IN AT 90 DEGREES */}
        <motion.div 
          className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[5vh] pointer-events-none bg-[#F5F5F7]"
          style={{ opacity: cleanRoomOpacity }}
        >
          <div className="w-[85vw] max-w-5xl text-[#111111] flex flex-col md:flex-row gap-12">
            <div className="flex-1">
              <h3 className="font-mono text-xs tracking-widest opacity-50 mb-4">SYSTEM_ARCHITECTURE</h3>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">NEXUSDESK</h2>
              <p className="text-lg md:text-xl opacity-80 max-w-lg mb-8 leading-relaxed">
                High-performance operational dashboard engineered for zero-latency data mutation and fluid user experience.
              </p>
              <div className="flex flex-wrap gap-4 font-mono text-xs font-bold uppercase">
                <span className="bg-[#111] text-[#F5F5F7] px-4 py-2 rounded-full">React / TypeScript / Node</span>
                <span className="border border-[#111]/20 px-4 py-2 rounded-full">DEPLOYED</span>
              </div>
            </div>
            <div className="flex-1 bg-[#111]/5 rounded-3xl min-h-[40vh] border border-[#111]/10 flex items-center justify-center">
               <span className="font-mono text-xs opacity-30">ASSET_VIEWPORT</span>
            </div>
          </div>
        </motion.div>

        {/* LAYER 3: THE HEAVY CD SCRUBBER */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* ENTRANCE ANIMATOR */}
          <motion.div
            initial={{ y: "100vh" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[55%] w-[70vw] aspect-square z-40 pointer-events-auto" // UPSIZED TO 70vw
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            onPanStart={() => setIsDragging(true)}
            onPanEnd={() => setIsDragging(false)}
            onPan={(_, info) => {
              let current = rotation.get();
              let drag = (info.delta.x - info.delta.y);
              let friction = 0.4;

              // THE RESISTANCE ZONE: Between 60 and 90 degrees clockwise, the disc heavily resists turning.
              if (current > 60 && drag > 0) {
                friction = 0.08; 
              }

              let newRot = current + (drag * friction); 
              
              // THE NEW HARD CLAMPS
              if (newRot < -360) newRot = -360; // Allows free-spinning backward
              if (newRot > 91) newRot = 91;     // Hard physical lock just past the flashbang
              
              rotation.set(newRot); 
            }}
            onMouseEnter={() => setActiveZone("cd")}
          >
            {/* INNER DISC - NOW DRIVEN BY THE VISUAL SNAP */}
            <motion.div className="relative w-full h-full rounded-full" style={{ rotate: visualCdRotation }}>
              
              {/* SCRATCHED ASSET */}
              <motion.img 
                src="/yeezus-cd.webp" 
                className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none" 
                style={{ opacity: brutalistOpacity }}
              />
              
              {/* CLEAN ASSET */}
              <motion.img 
                src="/yeezus-disc-clean.webp" 
                className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none drop-shadow-2xl" 
                style={{ opacity: cleanRoomOpacity }}
              />
              
              {/* RED TAPE HAS BEEN COMPLETELY PURGED */}
              
            </motion.div>
          </motion.div>
          </motion.div>
        </div>

          {/* INDUSTRIAL HUD (BRUTALISM) */}
          <motion.div className="absolute inset-0 z-40 pointer-events-none overflow-hidden" style={{ opacity: elementOpacity }}>
            
            {/* PRINTER REGISTRATION LAYER */}
            <div className="absolute inset-0 z-0 pointer-events-none p-6 flex flex-col justify-between opacity-70 mix-blend-multiply">
              {/* Top Row: Crops & Crosshair */}
              <div className="flex justify-between items-start">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#151515]"><path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor"/></svg>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#151515]"><path d="M9,0 L11,0 L11,9 L20,9 L20,11 L11,11 L11,20 L9,20 L9,11 L0,11 L0,9 L9,9 Z" fill="currentColor"/></svg>
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#151515]"><path d="M40,0 L0,0 L0,2 L38,2 L38,40 L40,40 Z" fill="currentColor"/></svg>
              </div>
              
              {/* Bottom Row: Crops, Crosshair, & CMYK Bar */}
              <div className="flex justify-between items-end">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#151515]"><path d="M0,40 L40,40 L40,38 L2,38 L2,0 L0,0 Z" fill="currentColor"/></svg>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#151515]"><path d="M9,0 L11,0 L11,9 L20,9 L20,11 L11,11 L11,20 L9,20 L9,11 L0,11 L0,9 L9,9 Z" fill="currentColor"/></svg>
                
                <div className="flex items-end gap-2">
                  {/* CMYK Test Strip */}
                  <div className="flex gap-[2px]">
                    <div className="w-5 h-5 bg-[#00A3E0]" />
                    <div className="w-5 h-5 bg-[#E20074]" />
                    <div className="w-5 h-5 bg-[#FFED00]" />
                    <div className="w-5 h-5 bg-[#050505]" />
                  </div>
                  {/* Bottom Right Crop */}
                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#151515]"><path d="M40,40 L0,40 L0,38 L38,38 L38,0 L40,0 Z" fill="currentColor"/></svg>
                </div>
              </div>
            </div>
            {/* Raw Geometric Barcode / Scale */}
            <div className="absolute bottom-8 left-8 flex items-end gap-1 opacity-90 mix-blend-multiply">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-[#0a0a0a]"
                  style={{ 
                    width: i % 3 === 0 ? "4px" : "2px", 
                    height: i % 4 === 0 ? "32px" : "16px" 
                  }} 
                />
              ))}
            </div>
          </motion.div>
        </div>

      {/* LAYER 999: STATE-DRIVEN FLASHBANG OVERLAY */}
      <motion.div 
        className="fixed inset-0 z-[999] pointer-events-none bg-white"
        initial={{ opacity: 0 }}
        // When hasFlashed turns true, it forces a 0 -> 1 -> 0 opacity animation over 0.6 seconds
        animate={{ opacity: hasFlashed ? [0, 1, 0] : 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
      />
    </motion.main>  
  );
}
