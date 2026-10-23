"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
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
  const [isMounted, setIsMounted] = useState(false);
  const [containerNode, setContainerNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll mapping logic - pass target only once DOM node is actually attached & hydrated
  const containerRef = useRef<HTMLElement | null>(null);
  const animatedFaceRef = useRef<HTMLImageElement>(null);
  const staticFaceRef = useRef<HTMLDivElement>(null);
  const hasPlayedRef = useRef(false);
  const corruptionRef = useRef<HTMLDivElement>(null);
  
  // 1. The local reference for the About Me container
  const aboutMeRef = useRef<HTMLDivElement>(null);
  
  // 2. Localized scroll tracking (0.0 = top enters viewport, 1.0 = bottom hits bottom of viewport)
  const { scrollYProgress: aboutMeProgress } = useScroll({
    target: aboutMeRef,
    offset: ["start bottom", "end end"] as any
  });

  const { scrollYProgress, scrollY } = useScroll({
    target: containerNode ? containerRef : undefined,
    offset: ["start start", "end start"] // Now tracks the 100vh unpin phase
  });
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
      let current = rotation.get();
      const isAtEndOfProjects = current >= 450;

      // If the timeline is complete and the user is scrolling down, let the browser scroll naturally.
      // Also allow native scrolling if the page is already scrolled vertically.
      if ((isAtEndOfProjects && e.deltaY > 0) || window.scrollY > 0) {
        return;
      }

      e.preventDefault();
      
      // DYNAMIC FRICTION CURVE:
      // If rotation < 100 (Initializer phase), use heavy friction (0.035) so it lasts longer.
      // If rotation >= 100 (Project phase), use light friction (0.12) to break snap-wells.
      let dynamicMultiplier = current < 100 ? 0.035 : 0.12; 
      
      let newRot = current + (e.deltaY * dynamicMultiplier);

      // Enforce the exact same clamps as the drag physics
      if (newRot < -360) newRot = -360;
      if (newRot > 450) newRot = 450; 

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
      if (newRot > 450) newRot = 450; 
      
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
  const textZScale = useTransform(smoothRotation, [0, 90], [1, 1], { clamp: true });
  const textBlur = useTransform(smoothRotation, [-360, 0, 50, 90, 450], ["blur(0px)", "blur(0px)", "blur(4px)", "blur(25px)", "blur(25px)"], { clamp: true });
  const elementOpacity = useTransform(smoothRotation, [-360, 0, 70, 90, 450], [1, 1, 0.8, 0, 0], { clamp: true }); 

  // Kinetic Aberration Engine
  const rgbShadow = useTransform(newSmoothVelocity, [-800, 0, 800], [
      "-8px 0px 0px rgba(212,17,17,0.8), 8px 0px 0px rgba(0,255,255,0.8)",
      "0px 0px 0px rgba(212,17,17,0), 0px 0px 0px rgba(0,255,255,0)",
      "8px 0px 0px rgba(212,17,17,0.8), -8px 0px 0px rgba(0,255,255,0.8)"
    ], { clamp: true });
  const shear = useTransform(newSmoothVelocity, [-800, 0, 800], [-8, 0, 8], { clamp: true });
  const jitter = useTransform(newSmoothVelocity, [-800, 0, 800], [-15, 0, 15], { clamp: true });
  const inverseJitter = useTransform(jitter, (val) => val * -0.5);

  // We need the absolute magnitude of the combined velocity (scrolling or CD scratching) for the subliminal flashes
  const velocityMagnitude = useTransform(
    [smoothRotation, spinVelocity],
    ([sv, rv]) => Math.max(Math.abs(sv as number), Math.abs((rv as number) * 15))
  );

  // 6. Tesseract Kinetic Spike (1x normal speed, 4x under heavy RPM)
  const tesseractSpike = useTransform(smoothVelocity, [-800, 0, 800], [4, 1, 4], { clamp: true });

  // Environment Opacities (Strict bounds prevent extrapolation rendering bugs)
  const brutalistOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 270, 450], [1, 1, 1, 0, 0, 0], { clamp: true });
  const cleanRoomOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 270, 450], [0, 0, 0, 1, 1, 1], { clamp: true });

  // 1. Initializer Morph (Wider Threshold: 95° to 105°)
  // Fades in at 89, but never fades out. It becomes the permanent header.
  const initializerOpacity = useTransform(smoothRotation, [88.9, 90], [0, 1], { clamp: true });

  // Evaporates early during the initial scroll
  const microUiOpacity = useTransform(smoothRotation, [-360, 0, 80, 370, 450], [1, 1, 0, 0, 0], { clamp: true });

  // 1. Text Physics (Starts higher at 35vh, moves to top-left)
  const initTop = useTransform(smoothRotation, [-360, 0, 110, 140, 360, 450], ["35vh", "35vh", "35vh", "5vh", "5vh", "5vh"], { clamp: true });
  const initLeft = useTransform(smoothRotation, [-360, 0, 110, 140, 360, 450], ["50vw", "50vw", "50vw", "1vw", "1vw", "1vw"], { clamp: true });
  const initX = useTransform(smoothRotation, [-360, 0, 110, 140, 360, 450], ["-50%", "-50%", "-50%", "0%", "0%", "0%"], { clamp: true });
  const initY = useTransform(smoothRotation, [-360, 0, 110, 140, 360, 450], ["-50%", "-50%", "-50%", "0%", "0%", "0%"], { clamp: true });
  const initScale = useTransform(smoothRotation, [-360, 0, 110, 140, 360, 450], [1, 1, 1, 0.25, 0.25, 0.25], { clamp: true });

  // Timeline Entrance (Fades in and slides up)
  const timelineEntranceOpacity = useTransform(smoothRotation, [-360, 0, 110, 140, 360, 380, 450], [0, 0, 0, 1, 1, 0, 0], { clamp: true });
  const showcaseDropY = useTransform(smoothRotation, [-360, 0, 110, 140, 360, 450], [100, 100, 100, 0, 0, 0], { clamp: true }); // 100px drop to 0px

  // 2. Layer 3 Dimensions & Physics (Restored Disc Proportions & 6-Stage Runway)
  // Phase 1 (0.00 - 0.15 / 0 - 140): Disc -> Timeline
  // Phase 2 (0.15 - 0.75 / 140 - 370): Horizontal Projects Scroll (Timeline holds at 40vw / 600px)
  // Phase 3 (0.75 - 0.85 / 370 - 402): Unpin Begins. Fast lift-off into the 160px Pill at -85vh.
  // Phase 4 (0.85 - 0.90 / 402 - 418): Expands to 140px Squircle.
  // Phase 5 (0.90 - 0.98 / 418 - 444): Holds Squircle shape. (Maximum runway for tick to play).
  // Phase 6 (0.98 - 1.00 / 444 - 450): Final crossfade into static Face ID icon.

  const timelineWidth = useTransform(
    smoothRotation, 
    [-360, 0, 110, 140, 370, 402, 418, 444, 450], 
    ["calc(70vw + 0px)", "calc(70vw + 0px)", "calc(70vw + 0px)", "calc(40vw + 0px)", "calc(40vw + 0px)", "calc(0vw + 160px)", "calc(0vw + 140px)", "calc(0vw + 140px)", "calc(0vw + 140px)"], 
    { clamp: true }
  );
  const cdWidth = timelineWidth;

  const timelineHeight = useTransform(
    smoothRotation, 
    [-360, 0, 110, 140, 370, 402, 418, 444, 450], 
    ["calc(70vw + 0px)", "calc(70vw + 0px)", "calc(70vw + 0px)", "calc(0vw + 64px)", "calc(0vw + 64px)", "calc(0vw + 36px)", "calc(0vw + 140px)", "calc(0vw + 140px)", "calc(0vw + 140px)"], 
    { clamp: true }
  );
  const cdHeight = timelineHeight;

  // The Y-Axis Flight: Centers disc at bottom (calc(55% + 0vh)), rests bar at calc(0% + -4vh), lifts to -85vh at 370-402
  const timelineY = useTransform(
    smoothRotation, 
    [-360, 0, 110, 140, 370, 402, 418, 444, 450], 
    ["calc(55% + 0vh)", "calc(55% + 0vh)", "calc(55% + 0vh)", "calc(0% + -4vh)", "calc(0% + -4vh)", "calc(0% + -85vh)", "calc(0% + -85vh)", "calc(0% + -85vh)", "calc(0% + -85vh)"], 
    { clamp: true }
  );
  const cdY = timelineY;

  const timelineRadius = useTransform(
    smoothRotation, 
    [-360, 0, 110, 140, 370, 402, 418, 444, 450], 
    [
      "inset(0px round calc(50% + 0px))", 
      "inset(0px round calc(50% + 0px))", 
      "inset(0px round calc(50% + 0px))", 
      "inset(0px round calc(0% + 999px))", 
      "inset(0px round calc(0% + 999px))", 
      "inset(0px round calc(0% + 36px))", 
      "inset(0px round calc(0% + 36px))", 
      "inset(0px round calc(0% + 36px))", 
      "inset(0px round calc(0% + 36px))"
    ], 
    { clamp: true }
  );
  const cdClip = timelineRadius;

  // Layer 3 Surface Materials
  const timelineBg = useTransform(
    smoothRotation, 
    [-360, 0, 105, 110, 370, 402, 418, 450], 
    ["transparent", "transparent", "transparent", "#1D1D1F", "#1D1D1F", "#000000", "#000000", "#000000"], 
    { clamp: true }
  );
  const cdBg = timelineBg;
  const cdBorder = useTransform(smoothRotation, [-360, 0, 105, 110, 370, 418, 450], ["1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0.15)", "1px solid rgba(255,255,255,0.15)", "1px solid rgba(255,255,255,0.3)", "1px solid rgba(52,199,89,0.5)"], { clamp: true });
  const cdBackdrop = useTransform(smoothRotation, [-360, 0, 110, 140, 370, 418, 450], ["blur(0px)", "blur(0px)", "blur(0px)", "blur(12px)", "blur(12px)", "blur(12px)", "blur(0px)"], { clamp: true });

  // Internal Fades (CD fades out early, Bar UI fades in late, crossfades to FaceID)
  const cdBrutalistOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 105, 110, 360, 450], [1, 1, 1, 0, 0, 0, 0, 0], { clamp: true });
  const cdCleanOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 105, 110, 360, 450], [0, 0, 0, 1, 1, 0, 0, 0], { clamp: true });
  
  // Fades out exactly as the squircle expansion begins
  const innerTimelineOpacity = useTransform(smoothRotation, [-360, 0, 130, 140, 370, 385], [0, 0, 0, 1, 1, 0], { clamp: true });
  const barUiOpacity = innerTimelineOpacity;

  // FaceID Crossfade (happens during the FaceID expansion at the top)
  const faceIdOpacity = useTransform(smoothRotation, [-360, 0, 402, 418, 450], [0, 0, 0, 1, 1], { clamp: true });

  // Tick fades in quickly during squircle expansion (0.85-0.90 / 402-418), holds at 100% until 0.98 / 444, then fades out.
  const tickOpacityFromScroll = useTransform(scrollYProgress, [0.85, 0.90, 0.98, 1.0], [0, 1, 1, 0]);
  const tickOpacityFromRot = useTransform(smoothRotation, [-360, 0, 402, 418, 444, 450], [0, 0, 0, 1, 1, 0], { clamp: true });
  const tickOpacity = useTransform([tickOpacityFromScroll, tickOpacityFromRot], ([s, r]) => Math.max(s as number, r as number));

  // Static Face fades in strictly during the final 2% (0.98-1.0 / 444-450)
  const staticFaceOpacityFromScroll = useTransform(scrollYProgress, [0.98, 1.0], [0, 1]);
  const staticFaceOpacityFromRot = useTransform(smoothRotation, [-360, 0, 444, 450], [0, 0, 0, 1], { clamp: true });
  const staticFaceOpacity = useTransform([staticFaceOpacityFromScroll, staticFaceOpacityFromRot], ([s, r]) => Math.max(s as number, r as number));

// Deterministic pseudo-random generator with fixed seed to eliminate SSR/hydration mismatches
function createPRNG(seed = 1337) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

  // Generates 1500 tiny, sharp Minecraft pixels that spread organically
  const corruptionPixels = useMemo(() => {
    const rand = createPRNG(42);
    const pixels: Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      threshold: number;
      code: string;
      isFinal?: boolean;
    }> = [];
    const seeds = [{ x: 50, y: 50 }, { x: 20, y: 80 }, { x: 80, y: 20 }]; // 3 origin points
    
    for (let i = 0; i < 1500; i++) {
      const parent = i < 3 ? seeds[i] : pixels[Math.floor(rand() * i)];
      const x = parent.x + (rand() - 0.5) * 5; 
      const y = parent.y + (rand() - 0.5) * 5;
      
      pixels.push({
        id: i,
        x: Number(Math.max(0, Math.min(100, x)).toFixed(4)),
        y: Number(Math.max(0, Math.min(100, y)).toFixed(4)),
        size: Number((rand() * 1.5 + 0.5).toFixed(4)),
        threshold: Number(((i / 1500) * 0.98).toFixed(4)),
        code: `0x${Math.floor(rand() * 16777215).toString(16).toUpperCase().padStart(6, "0")}`
      });
    }

    pixels.push({ 
      id: 9999, x: 0, y: 0, size: 100, threshold: 0.99, isFinal: true,
      code: "SYS_FAILURE_COMPLETE // NULL_PTR // OVERRIDE // " 
    });

    return pixels;
  }, []);



  // Timeline Progress Fill (Maps the exact checkpoints 160° -> 370°)
  const progressFill = useTransform(smoothRotation, [-360, 0, 160, 230, 300, 370, 450], ["0%", "0%", "0%", "33.33%", "66.66%", "100%", "100%"], { clamp: true });
  // Kinetic Flashbang (Spikes at 89, decays immediately by 89.5)
  const flashbangOpacity = useTransform(smoothRotation, [-360, 0, 88.9, 89, 89.5, 180, 450], [0, 0, 0, 1, 0, 0, 0], { clamp: true });





  // 4. Cursor State Override
  const globalCursor = useTransform(smoothRotation, [-360, 0, 88.9, 89, 450], ["none", "none", "none", "default", "default"], { clamp: true });


  const [isDragging, setIsDragging] = useState(false);
  const [hasBooted, setHasBooted] = useState(false);
  const [isHoveringCD, setIsHoveringCD] = useState(false);
  useMotionValueEvent(smoothRotation, "change", (latest) => {
    if (!animatedFaceRef.current) return;
    if (latest >= 402 && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      animatedFaceRef.current.src = `/Apple Face ID.svg?t=${Date.now()}`;
    } else if (latest < 370 && scrollYProgress.get() < 0.75) {
      hasPlayedRef.current = false;
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 1. DIAGNOSTIC LOGGER:
    console.log(`[SCROLL TELEMETRY] Current: ${latest.toFixed(4)}`);

    if (animatedFaceRef.current) {
      if (latest >= 0.85 && !hasPlayedRef.current) {
        hasPlayedRef.current = true;
        animatedFaceRef.current.src = `/Apple Face ID.svg?t=${Date.now()}`;
      } else if (latest < 0.75) {
        hasPlayedRef.current = false;
      }
    }
  });

  // THIS MUST NOW TRACK aboutMeProgress, NOT scrollYProgress
  useMotionValueEvent(aboutMeProgress, "change", (latest) => {
    // DIAGNOSTIC LOGGER FOR THE ISOLATED SECTION:
    console.log(`[ABOUT ME TELEMETRY] Local Progress: ${latest.toFixed(4)}`);

    if (corruptionRef.current) {
      // 0.60 now guarantees the About Me section is physically 60% visible on screen
      if (latest >= 0.60) {
        // Map the remaining 40% of the section's scroll directly to 100% intensity
        const intensity = (latest - 0.60) * 2.5; 
        const clampedIntensity = Math.min(1, Math.max(0, intensity));
        
        corruptionRef.current.style.opacity = "1";
        corruptionRef.current.style.setProperty('--meltdown', clampedIntensity.toString());
      } else {
        corruptionRef.current.style.opacity = "0";
        corruptionRef.current.style.setProperty('--meltdown', "0");
      }
    }
  });

  const handleBootComplete = useCallback(() => {
    setHasBooted(true);
  }, []);

  if (!hasBooted) {
    return <PreRenderBoot onComplete={handleBootComplete} />;
  }

  return (
    <>
      {/* LAYER 2: FOREGROUND CONTENT (The user's actual site) */}
      <motion.div
        ref={(node) => {
          containerRef.current = node;
          if (node && containerNode !== node) {
            setContainerNode(node);
          }
        }}
        id="foreground-content"
        className="relative w-full h-dvh overflow-x-hidden max-w-[100vw] overflow-y-hidden bg-black touch-pan-y"
        style={{ cursor: globalCursor }}
      >
      {/* Sticky container — keeps the visual viewport locked while scrolling drives physics */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">


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
              className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center flex-col w-full h-full"
              style={{ opacity: brutalistOpacity }}
            >
              <h1 className="text-[17vw] md:text-[15vw] font-black tracking-tighter text-[#E8E8E6] leading-none opacity-90 whitespace-nowrap text-center">
                SIDDHANT
              </h1>
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
            style={{ opacity: timelineEntranceOpacity, y: showcaseDropY }}
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

      </div>

      {/* LAYER 999: UNIFIED PHYSICS FLASHBANG */}
      <motion.div 
        className="fixed inset-0 z-[999] pointer-events-none bg-white mix-blend-screen backdrop-brightness-200"
        style={{ opacity: flashbangOpacity }}
      />

      {/* 1. ATTACH THE REF TO THE ABOUT ME WRAPPER */}
      <section ref={aboutMeRef as any} className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center">
        {/* ... [EXISTING ABOUT ME CONTENT] ... */}

        {/* 2. THE LOCALIZED CORRUPTION ENGINE */}
        <div 
          ref={corruptionRef}
          suppressHydrationWarning
          className="absolute inset-0 pointer-events-none z-[50] overflow-hidden transition-opacity duration-75"
          style={{ opacity: 0 }}
        >
          {corruptionPixels.map((p) => (
            <div
              key={p.id}
              className="absolute bg-black text-[#ff003c] font-mono leading-none flex items-start justify-start overflow-hidden break-all"
              style={{
                left: `${p.x}%`, 
                top: `${p.y}%`, 
                width: p.isFinal ? '100%' : `${p.size}vw`, 
                height: p.isFinal ? '100%' : `${p.size}vw`, 
                fontSize: p.isFinal ? "16px" : "10px",
                opacity: `clamp(0, calc((var(--meltdown) - ${p.threshold}) * 9999), 1)`
              }}
            >
              {/* INCREASED REPETITION TO PREVENT EMPTY BLACK VOIDS ON 4K MONITORS */}
              {p.code.repeat(p.isFinal ? 2000 : 15)} 
            </div>
          ))}
        </div>
      </section>
    </motion.div>

    {/* PORTAL TO ESCAPE SMOOTH SCROLL TRANSFORM */}
    {isMounted && typeof document !== "undefined" && createPortal(
      <motion.div 
        id="portal-content"
        className="fixed bottom-0 left-1/2 z-[9999] overflow-hidden flex items-center justify-center touch-none shadow-2xl" 
        transition={{ type: "spring", mass: 2.5, damping: 35, stiffness: 80 }}
        style={{ 
          x: "-50%",
          width: timelineWidth,
          height: timelineHeight,
          y: timelineY, // <-- THIS COMMANDS THE FLIGHT
          clipPath: timelineRadius,
          WebkitClipPath: timelineRadius,
          background: timelineBg,
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
          const current = rotation.get();
          
          // Detect mobile viewport for aggressive scaling
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          const sensitivity = isMobile ? 3.5 : 1.5; 
          
          const drag = (info.delta.x - info.delta.y) * sensitivity;
          
          // DYNAMIC PAN FRICTION:
          // Heavy drag resistance during intro, lighter resistance during projects
          const dynamicFriction = current < 100 ? 0.05 : 0.25; 
          
          let newRot = current + (drag * dynamicFriction); 
          
          if (newRot < -360) newRot = -360; 
          if (newRot > 450) newRot = 450; 
          
          rotation.set(newRot); 
        }}
        onMouseEnter={() => { setActiveZone("cd"); setIsHoveringCD(true); }}
        onMouseLeave={() => setIsHoveringCD(false)}
      >
         {/* STATE 0: BRUTALIST CD (Fades out during morph) */}
         <motion.img 
           src="/yeezus-cd.webp" 
           className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-full" 
           style={{ opacity: cdBrutalistOpacity, rotate: smoothRotation }} 
         />
         
         {/* STATE 1: CLEAN CD (Fades out during morph) */}
         <motion.img 
           src="/yeezus-disc-clean.webp" 
           className="absolute inset-0 w-full h-full object-cover pointer-events-none drop-shadow-2xl rounded-full" 
           style={{ opacity: cdCleanOpacity, rotate: smoothRotation }} 
         />

         {/* STATE 2: INNER DYNAMIC ISLAND OVERLAY (Timeline UI) */}
         <motion.div style={{ opacity: innerTimelineOpacity }} className="relative w-full h-full flex items-center justify-center">
            {/* FORCE THE TRACK AND DOTS TO BE WHITE */}
            <div className="w-[80%] h-[2px] bg-white/20 relative flex items-center justify-between">
              {/* Active Progress Line */}
              <motion.div className="h-full bg-white absolute left-0 top-0" style={{ width: progressFill }} />
              
              {/* Dots - Make sure they use bg-white or bg-white/50 */}
              <div className="w-2 h-2 rounded-full bg-white relative z-10" />
              <div className="w-2 h-2 rounded-full bg-white/50 relative z-10" />
              <div className="w-2 h-2 rounded-full bg-white/50 relative z-10" />
              <div className="w-2 h-2 rounded-full bg-white/50 relative z-10" />
            </div>
         </motion.div>

         {/* STATE 3: FACE-ID GLYPH (Crossfades in during final morph) */}
         <motion.div 
            style={{ opacity: faceIdOpacity }} 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-[60]"
         >
            {/* ANIMATED TICK (Opacity locked to scroll wheel) */}
            <motion.img 
              ref={animatedFaceRef} 
              src="/Apple Face ID.svg" 
              alt="FaceID Scan"
              className="absolute w-32 h-32 object-contain" 
              style={{ opacity: tickOpacity }}
            />

            {/* STATIC FACE ID (Opacity locked to scroll wheel) */}
            <motion.div 
              ref={staticFaceRef} 
              className="absolute flex items-center justify-center w-32 h-32 text-[#30D158] scale-[0.85]"
              style={{ opacity: staticFaceOpacity }}
            >
              <svg width="100%" height="100%" viewBox="0 0 80 80" fill="currentColor">
                <g fillRule="nonzero">
                  {/* Corners */}
                  <path d="M4.11428571,21.9428571 L4.11428571,13.0285714 C4.11428571,7.99327149 7.99327149,4.11428571 13.0285714,4.11428571 L21.9428571,4.11428571 C23.0789858,4.11428571 24,3.19327149 24,2.05714286 C24,0.921014229 23.0789858,0 21.9428571,0 L13.0285714,0 C5.72101423,0 0,5.72101423 0,13.0285714 L0,21.9428571 C0,23.0789858 0.921014229,24 2.05714286,24 C3.19327149,24 4.11428571,23.0789858 4.11428571,21.9428571 Z" />
                  <path transform="translate(68.070175, 11.929825) scale(-1, 1) translate(-68.070175, -11.929825) translate(56.140351, 0.000000)" d="M4.11428571,21.9428571 L4.11428571,13.0285714 C4.11428571,7.99327149 7.99327149,4.11428571 13.0285714,4.11428571 L21.9428571,4.11428571 C23.0789858,4.11428571 24,3.19327149 24,2.05714286 C24,0.921014229 23.0789858,0 21.9428571,0 L13.0285714,0 C5.72101423,0 0,5.72101423 0,13.0285714 L0,21.9428571 C0,23.0789858 0.921014229,24 2.05714286,24 C3.19327149,24 4.11428571,23.0789858 4.11428571,21.9428571 Z" />
                  <path transform="translate(11.929825, 68.070175) scale(1, -1) translate(-11.929825, -68.070175) translate(0.000000, 56.140351)" d="M4.11428571,21.9428571 L4.11428571,13.0285714 C4.11428571,7.99327149 7.99327149,4.11428571 13.0285714,4.11428571 L21.9428571,4.11428571 C23.0789858,4.11428571 24,3.19327149 24,2.05714286 C24,0.921014229 23.0789858,0 21.9428571,0 L13.0285714,0 C5.72101423,0 0,5.72101423 0,13.0285714 L0,21.9428571 C0,23.0789858 0.921014229,24 2.05714286,24 C3.19327149,24 4.11428571,23.0789858 4.11428571,21.9428571 Z" />
                  <path transform="translate(68.070175, 68.070175) scale(-1, -1) translate(-68.070175, -68.070175) translate(56.140351, 56.140351)" d="M4.11428571,21.9428571 L4.11428571,13.0285714 C4.11428571,7.99327149 7.99327149,4.11428571 13.0285714,4.11428571 L21.9428571,4.11428571 C23.0789858,4.11428571 24,3.19327149 24,2.05714286 C24,0.921014229 23.0789858,0 21.9428571,0 L13.0285714,0 C5.72101423,0 0,5.72101423 0,13.0285714 L0,21.9428571 C0,23.0789858 0.921014229,24 2.05714286,24 C3.19327149,24 4.11428571,23.0789858 4.11428571,21.9428571 Z" />
                  
                  {/* Eyes */}
                  <path transform="translate(21.754386, 28.070175)" d="M0,2.14285714 L0,7.86037654 C0,9.04384386 0.8954305,10.0032337 2,10.0032337 C3.1045695,10.0032337 4,9.04384386 4,7.86037654 L4,2.14285714 C4,0.959389822 3.1045695,0 2,0 C0.8954305,0 0,0.959389822 0,2.14285714 Z" />
                  <path transform="translate(54.736842, 28.070175)" d="M0,2.14285714 L0,7.86037654 C0,9.04384386 0.8954305,10.0032337 2,10.0032337 C3.1045695,10.0032337 4,9.04384386 4,7.86037654 L4,2.14285714 C4,0.959389822 3.1045695,0 2,0 C0.8954305,0 0,0.959389822 0,2.14285714 Z" />
                  
                  {/* Mouth */}
                  <path d="M25.9319616,59.0829234 C29.8331111,62.7239962 34.5578726,64.5614035 40,64.5614035 C45.4421274,64.5614035 50.1668889,62.7239962 54.0680384,59.0829234 C54.9180398,58.2895887 54.9639773,56.9574016 54.1706427,56.1074002 C53.377308,55.2573988 52.0451209,55.2114613 51.1951195,56.0047959 C48.0787251,58.9134307 44.382434,60.3508772 40,60.3508772 C35.617566,60.3508772 31.9212749,58.9134307 28.8048805,56.0047959 C27.9548791,55.2114613 26.622692,55.2573988 25.8293573,56.1074002 C25.0360227,56.9574016 25.0819602,58.2895887 25.9319616,59.0829234 Z" />
                  
                  {/* Nose */}
                  <path d="M40,30.1754386 L40,44.9122807 C40,45.85537 39.539042,46.3157895 38.5912711,46.3157895 L37.1929825,46.3157895 C36.0302777,46.3157895 35.0877193,47.2583479 35.0877193,48.4210526 C35.0877193,49.5837574 36.0302777,50.5263158 37.1929825,50.5263158 L38.5912711,50.5263158 C41.8633505,50.5263158 44.2105263,48.1818819 44.2105263,44.9122807 L44.2105263,30.1754386 C44.2105263,29.0127339 43.2679679,28.0701754 42.1052632,28.0701754 C40.9425584,28.0701754 40,29.0127339 40,30.1754386 Z" />
                </g>
              </svg>
            </motion.div>
          </motion.div>
      </motion.div>,
      document.body
    )}
  </>
  );
}
