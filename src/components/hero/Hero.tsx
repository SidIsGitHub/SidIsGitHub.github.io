"use client";

import { useState, useEffect, useRef } from "react";
import { useScroll, useTransform, useMotionValueEvent, useVelocity, useSpring, useMotionTemplate, motion, useMotionValue, MotionValue, animate } from "framer-motion";
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

  const snapToNearestCheckpoint = (currentVal: number) => {
    const checkpoints = [160, 230, 300, 370];
    const closest = checkpoints.reduce((prev, curr) => 
      Math.abs(curr - currentVal) < Math.abs(prev - currentVal) ? curr : prev
    );
    
    // If within 20 units (~25% of the 70-unit gap), snap to it
    if (Math.abs(currentVal - closest) <= 20) {
      animate(rotation, closest, { 
        type: "spring", 
        stiffness: 250, 
        damping: 30,
        mass: 1 
      });
    }
  };

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      let current = rotation.get();
      
      // DYNAMIC FRICTION CURVE:
      // If rotation < 100 (Initializer phase), use heavy friction (0.035) so it lasts longer.
      // If rotation >= 100 (Project phase), use light friction (0.12) to break snap-wells.
      let dynamicMultiplier = current < 100 ? 0.035 : 0.12; 
      
      let newRot = current + (e.deltaY * dynamicMultiplier);

      // Enforce the exact same clamps as the drag physics
      if (newRot < -360) newRot = -360;
      if (newRot > 370) newRot = 370; 

      rotation.set(newRot);

      // Clear previous timeout and set a new one
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Fires 150ms after the wheel stops moving
        snapToNearestCheckpoint(rotation.get());
      }, 150);
    };

    // NEW MOBILE TOUCH PROTOCOL:
    let lastTouchY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;
      
      let current = rotation.get();
      let dynamicMultiplier = current < 100 ? 0.035 : 0.12; 
      
      let newRot = current + (deltaY * dynamicMultiplier * 2.5); // Multiplied for better touch feel
      
      if (newRot < -360) newRot = -360;
      if (newRot > 370) newRot = 370; 
      
      rotation.set(newRot);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        snapToNearestCheckpoint(rotation.get());
      }, 150);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(scrollTimeout);
    };
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

  // Evaporates early during the initial scroll
  const microUiOpacity = useTransform(smoothRotation, [-360, 0, 80, 370], [1, 1, 0, 0]);

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
  const cdClip = useTransform(smoothRotation, [-360, 0, 110, 140, 360], ["inset(0px round calc(50% + 0px))", "inset(0px round calc(50% + 0px))", "inset(0px round calc(50% + 0px))", "inset(0px round calc(0% + 999px))", "inset(0px round calc(0% + 999px))"]);

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
      className="relative w-full h-dvh overflow-x-hidden max-w-[100vw] overflow-y-hidden bg-black touch-pan-y"
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


            {/* LAYER 1: BASELINE TYPOGRAPHY (TEMPORARY) */}
            <motion.div 
              className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center flex-col"
              style={{ opacity: brutalistOpacity }}
            >
              <h1 className="text-[17vw] md:text-[15vw] font-black tracking-tighter text-[#E8E8E6] leading-none opacity-90 whitespace-nowrap">
                SIDDHANT
              </h1>
            </motion.div>

            {/* LAYER 1.5: FOREGROUND PHYSICAL TEXTURE */}
            <motion.div 
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ opacity: brutalistOpacity }}
            >
              <div 
                className="absolute inset-0 opacity-[0.65] mix-blend-exclusion"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
              />
            </motion.div>
          </CursorMask>
        </motion.div>

        {/* LAYER 2: HIGH-DENSITY PREMIUM SHOWCASE */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none overflow-x-hidden w-full max-w-[100vw]"
          style={{ 
            opacity: cleanRoomOpacity,
            backgroundImage: 'radial-gradient(circle at 50% 0%, #ffffff 0%, #f5f5f7 60%, #e5e5ea 100%)' 
          }}
        >
          {/* VISION-OS AMBIENT LIGHTING (Place behind the project cards, z-index 0) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
              animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] left-[15%] w-[45vw] h-[45vw] bg-white rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ x: [0, -50, 0], y: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[-10%] right-[10%] w-[55vw] h-[55vw] bg-gray-200 rounded-full blur-[140px]"
            />
          </div>
          {/* LAYER 2.8: THE PROJECT TIMELINE */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-auto"
            style={{ opacity: timelineOpacity, y: timelineY }}
          >
            <PremiumShowcase rotation={smoothRotation} />
          </motion.div>
        </motion.div>

        {/* LAYER 2.1: BRUTALIST MICRO-TYPOGRAPHY */}
        <motion.div 
          className="fixed inset-0 z-10 pointer-events-none p-8 flex flex-col justify-between mix-blend-difference text-white/80 uppercase tracking-widest text-[0.65rem] sm:text-xs font-mono"
          style={{ opacity: microUiOpacity }}
        >
          {/* Top Meta Data */}
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-1">
              <span>Siddhant Bansod</span>
              <span className="opacity-50">Selected Works // 2026</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span>System Status: Online</span>
              <span className="opacity-50">Vol. 01</span>
            </div>
          </div>

          {/* Bottom Interaction Cue */}
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col gap-1">
              <span>Interact</span>
              <span className="opacity-50">[ Scroll or Drag ]</span>
            </div>
            <div className="flex flex-col gap-1 text-right animate-pulse">
              <span>Unlock</span>
              <span>Timeline ↓</span>
            </div>
          </div>
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
          <h1 className="text-[17vw] md:text-[15vw] font-black tracking-tighter text-[#1D1D1F] leading-none whitespace-nowrap mix-blend-exclusion">
            PROJECTS
          </h1>
        </motion.div>

        {/* LAYER 3: THE MORPHING SCRUBBER / PROGRESS BAR */}
        <motion.div 
          className="absolute bottom-0 left-1/2 z-40 overflow-hidden flex items-center justify-center touch-none" 
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
          onPanEnd={() => {
            setIsDragging(false);
            snapToNearestCheckpoint(rotation.get());
          }}
          onPan={(_, info) => {
            let current = rotation.get();
            
            // Detect mobile viewport for aggressive scaling
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const sensitivity = isMobile ? 3.5 : 1.5; 
            
            let drag = (info.delta.x - info.delta.y) * sensitivity;
            
            // DYNAMIC PAN FRICTION:
            // Heavy drag resistance during intro, lighter resistance during projects
            let dynamicFriction = current < 100 ? 0.05 : 0.25; 
            
            let newRot = current + (drag * dynamicFriction); 
            
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

           {/* STATE 2: INNER DYNAMIC ISLAND OVERLAY */}
           <motion.div 
              className="absolute inset-0 w-full h-full flex items-center justify-center px-6 pointer-events-none overflow-hidden z-50 bg-[#2C2C2E] !rounded-full"
              style={{ opacity: barUiOpacity }}
           >
              {/* Sleek Track Container */}
              <div className="relative w-full h-[4px] bg-[#333333] !rounded-full">
                
                {/* Pure White Apple Fill */}
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-white z-10 !rounded-full"
                  style={{ width: progressFill }}
                />
                
                {/* Perfectly Circular Checkpoint Nodes */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between items-center z-20">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className="w-4 h-4 aspect-square shrink-0 bg-[#2C2C2E] border-[2px] border-[#444] shadow-md flex items-center justify-center !rounded-full overflow-hidden"
                    >
                      {/* Active inner dot */}
                      <div className="w-1 h-1 aspect-square shrink-0 bg-white/50 !rounded-full" />
                    </div>
                  ))}
                </div>
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
