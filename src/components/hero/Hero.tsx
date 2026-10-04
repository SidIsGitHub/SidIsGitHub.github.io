"use client";

import { useState, useEffect, useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent, useVelocity, useSpring, useMotionTemplate, motion, useMotionValue, MotionValue } from "framer-motion";
import ChaosLayer from "./ChaosLayer";
import CodeUnderworld from "./CodeUnderworld";
import CursorMask from "./CursorMask";
import PremiumShowcase from "./PremiumShowcase";
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

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      let current = rotation.get();
      
      // Normalize trackpad vs mouse wheel delta
      let rawDelta = e.deltaY;
      let scrollFriction = 0.15; 
      
      // Maintain the heavy friction "click" zone between 60° and 90°
      if (current > 60 && current < 90 && rawDelta > 0) {
        scrollFriction = 0.03;
      }

      let newRot = current + (rawDelta * scrollFriction);

      // Enforce the exact same clamps as the drag physics
      if (newRot < -360) newRot = -360;
      if (newRot > 370) newRot = 370; 

      rotation.set(newRot);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [rotation]);
  const spinVelocity = useVelocity(rotation);
  const newSmoothVelocity = useSpring(spinVelocity, { damping: 20, stiffness: 400 });

  // Flattened Scale (Text stays in place, only blurs/fades)
  const textZScale = useTransform(smoothRotation, [0, 90], [1, 1]);
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

  // Environment Opacities (Strict bounds prevent extrapolation rendering bugs)
  const brutalistOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 270], [1, 1, 1, 0, 0]);
  const cleanRoomOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 270], [0, 0, 0, 1, 1]);

  // 1. Initializer Morph (Wider Threshold: 95° to 105°)
  // Fades in at 89, but never fades out. It becomes the permanent header.
  const initializerOpacity = useTransform(smoothRotation, [88.9, 90], [0, 1]);

  // 1. Text Physics (Starts higher at 35vh, moves to top-left)
  const initTop = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["35vh", "35vh", "35vh", "5vh", "5vh"]);
  const initLeft = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["50vw", "50vw", "50vw", "4vw", "4vw"]);
  const initX = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["-50%", "-50%", "-50%", "0%", "0%"]);
  const initY = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["-50%", "-50%", "-50%", "0%", "0%"]);
  const initScale = useTransform(smoothRotation, [-360, 0, 110, 140, 360], [1, 1, 1, 0.25, 0.25]);

  // Timeline Entrance (Fades in and slides up)
  const timelineOpacity = useTransform(smoothRotation, [-360, 0, 110, 140, 360], [0, 0, 0, 1, 1]);
  const timelineY = useTransform(smoothRotation, [-360, 0, 110, 140, 360], [100, 100, 100, 0, 0]); // 100px drop to 0px

  // 2. Layer 3 Dimensions & Physics (Dynamic Island Morph)
  const cdWidth = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["70vw", "70vw", "70vw", "40vw", "40vw"]);
  // Framer string interpolation trick for mixed units
  const cdHeight = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["calc(70vw + 0px)", "calc(70vw + 0px)", "calc(70vw + 0px)", "calc(0vw + 64px)", "calc(0vw + 64px)"]);
  const cdY = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["calc(55% + 0vh)", "calc(55% + 0vh)", "calc(55% + 0vh)", "calc(0% - 4vh)", "calc(0% - 4vh)"]); 
  const cdClip = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["inset(0px round calc(50% + 0px))", "inset(0px round calc(50% + 0px))", "inset(0px round calc(50% + 0px))", "inset(0px round calc(0% + 100px))", "inset(0px round calc(0% + 100px))"]);

  // Layer 3 Surface Materials
  const cdBg = useTransform(smoothRotation, [-360, 0, 105, 110, 360], ["rgba(255,255,255,0)", "rgba(255,255,255,0)", "rgba(255,255,255,0)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.8)"]);
  const cdBorder = useTransform(smoothRotation, [-360, 0, 105, 110, 360], ["1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0.3)", "1px solid rgba(255,255,255,0.3)"]);
  const cdBackdrop = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["blur(0px)", "blur(0px)", "blur(0px)", "blur(12px)", "blur(12px)"]);

  // Internal Fades (CD fades out early, Bar UI fades in late)
  const cdBrutalistOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 105, 110, 360], [1, 1, 1, 0, 0, 0, 0]);
  const cdCleanOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 105, 110, 360], [0, 0, 0, 1, 1, 0, 0]);
  const barUiOpacity = useTransform(smoothRotation, [-360, 0, 130, 140, 360], [0, 0, 0, 1, 1]);

  // Timeline Progress Fill (Maps the exact checkpoints 160° -> 370°)
  const progressFill = useTransform(
    smoothRotation, 
    [-360, 0, 160, 230, 300, 370], 
    ["0%", "0%", "0%", "33.33%", "66.66%", "100%"]
  );
  // Kinetic Flashbang (Spikes at 89, decays immediately by 89.5)
  const flashbangOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 89.5, 180], [0, 0, 0, 1, 0, 0]);





  // 4. Cursor State Override
  const globalCursor = useTransform(smoothRotation, [-360, 0, 88.9, 89], ["none", "none", "none", "default"]);


  const [isDragging, setIsDragging] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const [isHoveringCD, setIsHoveringCD] = useState(false);





  if (!hasBooted) {
    return <PreRenderBoot onComplete={() => setHasBooted(true)} />;
  }

  return (
    <motion.main
      id="hero"
      className="relative w-full h-dvh overflow-hidden bg-black"
      style={{ cursor: globalCursor }}
    >
      {/* Sticky container — keeps the visual viewport locked while scrolling drives physics */}
      <div className="sticky top-0 w-full h-dvh overflow-hidden">
        
        {/* The Subliminal Engine - Passes the absolute magnitude of the scroll velocity */}
        <SubliminalFlashes velocity={velocityMagnitude} rotation={smoothRotation} />

        {/* Layer 1: CODE UNDERWORLD (STATIC BACKGROUND) */}
        <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ opacity: brutalistOpacity }}>
          <CodeUnderworld speedMultiplier={tesseractSpike} activeZone={activeZone} rawCode={rawCode} />
        </motion.div>


        {/* Layer 2: TEAR MASK WRAPPING THE ENTIRE UI */}
        <motion.div className="absolute inset-0 z-20" style={{ opacity: brutalistOpacity }}>
          <CursorMask scrollYProgress={scrollYProgress} isHoveringCD={isHoveringCD}>
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

        {/* LAYER 2: HIGH-DENSITY PREMIUM SHOWCASE */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none bg-[#F5F5F7]"
          style={{ opacity: cleanRoomOpacity }}
        >
          {/* LAYER 2.8: THE PROJECT TIMELINE */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-auto"
            style={{ opacity: timelineOpacity, y: timelineY }}
          >
            <PremiumShowcase rotation={smoothRotation} />
          </motion.div>
        </motion.div>

        {/* LAYER 2.5: THE MORPHING HEADER */}
        <motion.div 
          className="fixed z-20 pointer-events-none"
          style={{ 
            top: initTop,
            left: initLeft,
            x: initX,
            y: initY,
            scale: initScale,
            opacity: initializerOpacity,
            transformOrigin: "top left"
          }}
        >
          <h1 className="text-[15vw] font-black tracking-tighter text-[#1D1D1F] leading-none whitespace-nowrap">
            PROJECTS
          </h1>
        </motion.div>

        {/* LAYER 3: THE MORPHING SCRUBBER / PROGRESS BAR */}
        <motion.div 
          className="absolute bottom-0 left-1/2 z-40 overflow-hidden flex items-center justify-center" 
          transition={{ type: "spring", mass: 2.5, damping: 35, stiffness: 80 }}
          style={{ 
            x: "-50%",
            width: cdWidth,
            height: cdHeight,
            y: cdY, 
            clipPath: cdClip,
            WebkitClipPath: cdClip,
            background: cdBg,
            border: cdBorder,
            backdropFilter: cdBackdrop,
            WebkitBackdropFilter: cdBackdrop,
            cursor: isDragging ? "grabbing" : "grab",
          }} 
          onPanStart={() => setIsDragging(true)}
          onPanEnd={() => setIsDragging(false)}
          onPan={(_, info) => {
            let current = rotation.get();
            let drag = (info.delta.x - info.delta.y);
            let friction = current > 60 && drag > 0 ? 0.08 : 0.4;
            let newRot = current + (drag * friction); 
            
            if (newRot < -360) newRot = -360; 
            if (newRot > 370) newRot = 370; 
            
            rotation.set(newRot); 
          }}
          onMouseEnter={() => { setActiveZone("cd"); setIsHoveringCD(true); }}
          onMouseLeave={() => setIsHoveringCD(false)}
        >
           {/* STATE 0: BRUTALIST CD (Fades out during morph) */}
           <motion.img 
             src="/yeezus-cd.webp" 
             className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
             style={{ opacity: cdBrutalistOpacity, rotate: smoothRotation }} 
           />
           
           {/* STATE 1: CLEAN CD (Fades out during morph) */}
           <motion.img 
             src="/yeezus-disc-clean.webp" 
             className="absolute inset-0 w-full h-full object-cover pointer-events-none drop-shadow-2xl" 
             style={{ opacity: cdCleanOpacity, rotate: smoothRotation }} 
           />

           {/* STATE 2: THE APPLE PROGRESS BAR UI (Fades in during morph) */}
           <motion.div 
              className="absolute inset-0 w-full h-full px-6 flex items-center pointer-events-none"
              style={{ opacity: barUiOpacity }}
           >
              {/* The Track */}
              <div className="relative w-full h-2 bg-black/10 rounded-full overflow-hidden">
                {/* The Fill */}
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-[#1D1D1F] rounded-full"
                  style={{ width: progressFill }}
                />
              </div>
              
              {/* Optional: Tiny aesthetic checkpoints for the 4 projects */}
              <div className="absolute inset-0 px-6 flex justify-between items-center pointer-events-none">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#1D1D1F] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#1D1D1F] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#1D1D1F] shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#1D1D1F] shadow-sm" />
              </div>
           </motion.div>
        </motion.div>
      </div>

      {/* LAYER 999: UNIFIED PHYSICS FLASHBANG */}
      <motion.div 
        className="fixed inset-0 z-[999] pointer-events-none bg-white mix-blend-screen backdrop-brightness-200"
        style={{ opacity: flashbangOpacity }}
      />
    </motion.main>  
  );
}
