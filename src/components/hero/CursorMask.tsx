"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useVelocity, useSpring, useTransform, useMotionValueEvent, MotionValue, useMotionTemplate } from "framer-motion";
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
      maskTearRef.current.setAttribute("scale", (180 + latestSpeed * 4).toString());
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


      <div className="relative z-10 w-full h-full">
         {children}
      </div>

    </>
  );

  return (
    <>
      {/* SVG FILTER FOR JAGGED METAL TEAR */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <filter id="metal-tear" x="-300%" y="-300%" width="700%" height="700%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves="3" result="noise" />
            <feDisplacementMap ref={maskTearRef} in="SourceGraphic" in2="noise" scale="180" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <mask id="cursor-tear-mask" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="white" />
            <motion.circle 
              cx={mouseX} 
              cy={mouseY} 
              initial={{ r: 130 }} 
              animate={{ r: isHoveringCD ? 0 : 130 }} 
              transition={{ duration: 0.2 }} 
              fill="black" 
              filter="url(#metal-tear)" 
            />
          </mask>
        </defs>
      </svg>

      <motion.div
        className="absolute inset-0 z-10 w-screen h-screen pointer-events-auto"
        style={{
          WebkitMaskImage: "url(#cursor-tear-mask)",
          maskImage: "url(#cursor-tear-mask)",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        {surfaceUI}
      </motion.div>
    </>
  );
}
