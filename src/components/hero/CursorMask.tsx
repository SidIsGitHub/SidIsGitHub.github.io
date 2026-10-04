"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useVelocity, useSpring, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import { SurveillanceTerminal } from "./SurveillanceTerminal";
import { BackgroundAnxiety } from "./BackgroundAnxiety";

interface CursorMaskProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  isHoveringCD?: boolean;
}

export default function CursorMask({ children, scrollYProgress, isHoveringCD = false }: CursorMaskProps) {
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const smoothVelocityX = useSpring(velocityX, { damping: 50, stiffness: 400 });
  const smoothVelocityY = useSpring(velocityY, { damping: 50, stiffness: 400 });

  const speed = useTransform(
    [smoothVelocityX, smoothVelocityY],
    ([vx, vy]) => Math.min(Math.sqrt((vx as number) * (vx as number) + (vy as number) * (vy as number)) * 0.08, 150)
  );

  const maskTearRef = useRef<SVGFEDisplacementMapElement>(null);
  const surfaceWarpRef = useRef<SVGFEDisplacementMapElement>(null);

  useMotionValueEvent(speed, "change", (latestSpeed) => {
    if (maskTearRef.current) {
      maskTearRef.current.setAttribute("scale", (60 + latestSpeed * 1.2).toString());
    }
    if (surfaceWarpRef.current) {
      surfaceWarpRef.current.setAttribute("scale", (latestSpeed * 1.2).toString());
    }
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    
    let resizeTimer: number;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        checkMobile();
      }, 200);
    };
    window.addEventListener("resize", handleResize);

    if (isMobile) {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    }

    let lastTime = 0;
    const updateMousePosition = (e: MouseEvent) => {
      if (isMobile) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", updateMousePosition);
    
    if (!isMobile) {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    }

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(resizeTimer);
    };
  }, [isMobile, mouseX, mouseY]);

  const surfaceUI = (
    <>
      {/* 1. Base Metal Gradient (Brightened slightly in the center so the black text pops) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#d1d5db_0%,_#6b7280_40%,_#111827_100%)]" />

      {/* 2. Harsh Physical Grain */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* 3. The 1px Grid remains here... */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `
            repeating-linear-gradient(to right, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 64px),
            repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 1px, transparent 1px, transparent 64px)
          `
        }}
      />

      <BackgroundAnxiety />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[30vw] h-[10vh] opacity-20 mix-blend-multiply flex gap-1 z-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="bg-black h-full" style={{ width: `${((i * 13) % 8) + 2}px` }} />
        ))}
        <div className="absolute -bottom-4 left-0 w-full text-center font-mono text-[10px] tracking-[0.5em] text-black">
          CBR-200168 // PROMPTWARS_26
        </div>
      </div>

      <div className="absolute inset-0 p-8 z-0 pointer-events-none flex justify-between items-start font-mono text-[0.75rem] md:text-[0.85vw] leading-tight tracking-tight text-[#050505] opacity-75 mix-blend-multiply">
        <ul className="text-left font-bold uppercase transform rotate-1 translate-y-4 translate-x-2">
          <li>FastAPI_Engine</li>
          <li>NextJS_Edge</li>
          <li>OpenCV_Vision</li>
          <li>ESP32_Telemetry</li>
          <li>LangChain_RAG</li>
        </ul>
        <ul className="text-right font-bold uppercase transform -rotate-1 -translate-x-4 -skew-y-2">
          <li>CBR-200168</li>
          <li>FLUXX_SYS</li>
          <li>MEDIPANDA_AI</li>
          <li>IHATEPDFS_BOT</li>
          <li>PROMPTWARS_26</li>
        </ul>
      </div>

      <div className="relative z-10 w-full h-full">
         {children}
      </div>

      <SurveillanceTerminal />
    </>
  );

  return (
    <>
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="jagged-edge" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" result="noise" />
            <feDisplacementMap ref={maskTearRef} in="SourceGraphic" in2="noise" scale="60" xChannelSelector="R" yChannelSelector="G" edgeMode="duplicate" />
          </filter>

          <filter id="surface-warp" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004" numOctaves="2" result="warpNoise" />
            <feDisplacementMap ref={surfaceWarpRef} in="SourceGraphic" in2="warpNoise" scale="0" xChannelSelector="R" yChannelSelector="G" edgeMode="duplicate" />
          </filter>

          <g id="dead-zones">
            <rect x="5%" y="40%" width="3%" height="15%" />
            <rect x="82%" y="28%" width="8%" height="6%" />
            <rect x="60%" y="80%" width="20%" height="2%" />
          </g>

          <mask id="cursor-xor-105" maskUnits="userSpaceOnUse">
            <motion.circle cx={mouseX} cy={mouseY} initial={{ r: 105 }} animate={{ r: isHoveringCD ? 0 : 105 }} transition={{ duration: 0.2 }} fill="white" filter="url(#jagged-edge)" />
          </mask>
          <mask id="cursor-xor-210" maskUnits="userSpaceOnUse">
            <motion.circle cx={mouseX} cy={mouseY} initial={{ r: 210 }} animate={{ r: isHoveringCD ? 0 : 210 }} transition={{ duration: 0.2 }} fill="white" filter="url(#jagged-edge)" />
          </mask>

          <mask id="inner-hole-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="white" />
            <use href="#dead-zones" fill="black" />
            <motion.circle cx={mouseX} cy={mouseY} initial={{ r: 105 }} animate={{ r: isHoveringCD ? 0 : 105 }} transition={{ duration: 0.2 }} fill="black" filter="url(#jagged-edge)" />
            <use href="#dead-zones" fill="white" mask="url(#cursor-xor-105)" />
          </mask>

          <mask id="clean-layer-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="white" />
            <use href="#dead-zones" fill="black" />
            <motion.circle cx={mouseX} cy={mouseY} initial={{ r: 210 }} animate={{ r: isHoveringCD ? 0 : 210 }} transition={{ duration: 0.2 }} fill="black" filter="url(#jagged-edge)" />
            <use href="#dead-zones" fill="white" mask="url(#cursor-xor-210)" />
          </mask>

          <mask id="warped-layer-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="black" />
            <motion.circle cx={mouseX} cy={mouseY} initial={{ r: 212 }} animate={{ r: isHoveringCD ? 0 : 212 }} transition={{ duration: 0.2 }} fill="white" filter="url(#jagged-edge)" />
          </mask>
        </defs>
      </svg>

      <motion.div
        className="absolute inset-0 z-10 w-screen h-screen pointer-events-auto"
        style={{
          WebkitMaskImage: "url(#inner-hole-mask)",
          maskImage: "url(#inner-hole-mask)"
        }}
      >
        <motion.div 
          className="absolute inset-0"
          style={{
            WebkitMaskImage: "url(#clean-layer-mask)",
            maskImage: "url(#clean-layer-mask)"
          }}
        >
          {surfaceUI}
        </motion.div>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: "url(#surface-warp)",
            WebkitMaskImage: "url(#warped-layer-mask)",
            maskImage: "url(#warped-layer-mask)"
          }}
        >
          {surfaceUI}
        </motion.div>
      </motion.div>
    </>
  );
}
