"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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


  // The Rotary Physics & State Manager
  const rotation = useMotionValue(0);
  const rotationVelocityRaw = useVelocity(rotation);

  // We need the absolute magnitude of the combined velocity (scrolling or CD scratching)
  const velocityMagnitude = useTransform(
    [smoothVelocity, rotationVelocityRaw],
    ([sv, rv]) => Math.max(Math.abs(sv as number), Math.abs((rv as number) * 15))
  );

  // 1. Chromatic Aberration: Map velocity (0 - 1500) to an RGB shadow offset (0px to 40px)
  const rgbOffset = useTransform(velocityMagnitude, [0, 1500], [0, 40]);
  const rgbShadow = useMotionTemplate`${rgbOffset}px 0px 0px rgba(212,17,17,0.9), calc(${rgbOffset}px * -1) 0px 0px rgba(0,255,255,0.9)`;

  // 2. Horizontal Tearing: Map velocity to a violent CSS skew
  const shear = useTransform(velocityMagnitude, [0, 1500], [0, -35]);

  // 3. Glitch Jitter: Map velocity to random-feeling X-axis displacement
  const jitter = useTransform(velocityMagnitude, [0, 500, 1000, 1500], [0, -15, 20, -30]);
  const inverseJitter = useTransform(jitter, (val) => val * -0.5);

  const [activeProjectKey, setActiveProjectKey] = useState<keyof typeof PROJECT_REGISTRY>("fluxx");
  const [isDragging, setIsDragging] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);

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

  const renderTypography = (isUnderworld = false) => {
    const nameClass = isUnderworld
      ? "bg-[#D41111] text-[#EBEBEB] px-8 py-2 border-2 border-black"
      : "text-[#050505] mix-blend-multiply opacity-95";

    const subtextClass = isUnderworld
      ? "bg-[#D41111] text-[#EBEBEB] px-8 py-2 border-2 border-black"
      : "text-[#8a0303] mix-blend-multiply opacity-90";

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-[6vh] z-0 pointer-events-none font-sans">

        {/* 
          Convert to motion.h1 and attach the velocity physics. 
          Note: We keep the baseline layout transforms (-rotate-2, -skew-x-6) 
          but drive the dynamic shearing and glitching via Framer Motion's inline style.
        */}
        <motion.h1
          className="text-[17vw] font-black leading-[0.75] uppercase text-center flex flex-col items-center origin-bottom"
          style={{
            letterSpacing: "-0.08em",
            rotate: -2,       // Base static rotation
            skewX: shear,     // Velocity-driven horizontal tearing
            x: jitter,        // Velocity-driven jitter
            textShadow: isUnderworld ? "none" : rgbShadow // Velocity-driven RGB split (only on surface)
          }}
        >
          <span className={nameClass}>
            SIDDHANT
          </span>
        </motion.h1>

        <motion.h2
          className="text-[3.5vw] font-black leading-none tracking-widest uppercase mt-4 text-center origin-top"
          style={{
            skewX: shear,
            x: inverseJitter, // Jitters in the opposite direction
            textShadow: isUnderworld ? "none" : rgbShadow
          }}
        >
          <span className={subtextClass}>
            REPEL MEDIOCRITY
          </span>
        </motion.h2>

      </div>
    );
  };

  const handleBoot = useCallback(() => setHasBooted(true), []);

  if (!hasBooted) {
    return <PreRenderBoot onComplete={handleBoot} />;
  }

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "300vh" }} // Extra height for scroll-driven disc rotation
    >
      {/* Sticky container — keeps the visual viewport locked while scrolling drives physics */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">

        {/* The Subliminal Engine - Passes the absolute magnitude of the scroll velocity */}
        <SubliminalFlashes velocity={velocityMagnitude} />

        {/* Layer 1: CODE UNDERWORLD (STATIC BACKGROUND) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <CodeUnderworld activeZone={activeZone} rawCode={activeProject.code} />
          {renderTypography(true)}
        </div>

        {/* Layer 2: TEAR MASK WRAPPING THE ENTIRE UI */}
        <div className="absolute inset-0 z-20">
          <CursorMask scrollYProgress={scrollYProgress}>
            {/* CHAOS LAYER (Black Background) */}
            <div className="absolute inset-0 pointer-events-auto" onMouseEnter={() => setActiveZone("surface")}>
              <ChaosLayer />
            </div>

            {/* 3. The Typography (z-0) - Sits flat on the background */}
            {renderTypography(false)}
          </CursorMask>
        </div>

        {/* Layer 3: PERMANENTLY INTACT HARDWARE (Sits ON TOP of the mask tear) */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* THE PHYSICAL SCRUBBER (Navigation Dial) */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[55%] w-[75vw] aspect-square z-40 pointer-events-auto"
            style={{ rotate: rotation }}
            // The tactile physics
            onPanStart={() => setIsDragging(true)}
            onPanEnd={() => setIsDragging(false)}
            onPan={(_, info) => {
              // Mapping X/Y drag velocity directly to rotation (heavy, 1:1 mechanical feel)
              const delta = info.delta.x - info.delta.y;
              rotation.set(rotation.get() + delta * 0.5); // 0.5 adds physical resistance
            }}
          >
            {/* The image layers must have pointer-events-auto and proper cursor styling */}
            <div className={`relative w-full h-full rounded-full overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} pointer-events-auto`} onMouseEnter={() => setActiveZone("cd")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/yeezus-cd.webp"
                alt="Yeezus CD"
                className="absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none"
              />
            </div>
          </motion.div>

          {/* INDUSTRIAL HUD (BRUTALISM) */}
          <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">

            {/* PRINTER REGISTRATION LAYER */}
            <div className="absolute inset-0 z-0 pointer-events-none p-6 flex flex-col justify-between opacity-70 mix-blend-multiply">
              {/* Top Row: Crops & Crosshair */}
              <div className="flex justify-between items-start">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#151515]"><path d="M0,0 L40,0 L40,2 L2,2 L2,40 L0,40 Z" fill="currentColor" /></svg>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#151515]"><path d="M9,0 L11,0 L11,9 L20,9 L20,11 L11,11 L11,20 L9,20 L9,11 L0,11 L0,9 L9,9 Z" fill="currentColor" /></svg>
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#151515]"><path d="M40,0 L0,0 L0,2 L38,2 L38,40 L40,40 Z" fill="currentColor" /></svg>
              </div>

              {/* Bottom Row: Crops, Crosshair, & CMYK Bar */}
              <div className="flex justify-between items-end">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#151515]"><path d="M0,40 L40,40 L40,38 L2,38 L2,0 L0,0 Z" fill="currentColor" /></svg>
                <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#151515]"><path d="M9,0 L11,0 L11,9 L20,9 L20,11 L11,11 L11,20 L9,20 L9,11 L0,11 L0,9 L9,9 Z" fill="currentColor" /></svg>

                <div className="flex items-end gap-2">
                  {/* CMYK Test Strip */}
                  <div className="flex gap-[2px]">
                    <div className="w-5 h-5 bg-[#00A3E0]" />
                    <div className="w-5 h-5 bg-[#E20074]" />
                    <div className="w-5 h-5 bg-[#FFED00]" />
                    <div className="w-5 h-5 bg-[#050505]" />
                  </div>
                  {/* Bottom Right Crop */}
                  <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#151515]"><path d="M40,40 L0,40 L0,38 L38,38 L38,0 L40,0 Z" fill="currentColor" /></svg>
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
          </div>
        </div>
      </div>
    </section>
  );
}
