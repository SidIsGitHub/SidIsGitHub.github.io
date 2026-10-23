"use client";
import React, { useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

// Deterministic pseudo-random generator with fixed seed to eliminate SSR/hydration mismatches
function createPRNG(seed = 1337) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function SterileIdentity() {
  const sectionRef = useRef<HTMLElement>(null);
  const corruptionRef = useRef<HTMLDivElement>(null);
  const meltdownRef = useRef(0);

  // SHARP MINECRAFT CANCER SPREAD ENGINE (1500 Clustered Pixels)
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
    const seeds = [{ x: 50, y: 50 }, { x: 20, y: 80 }, { x: 80, y: 20 }]; // 3 origin tumor points
    
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

    // Final screen-swallowing failure block
    pixels.push({ 
      id: 9999, x: 0, y: 0, size: 100, threshold: 0.99, isFinal: true,
      code: "SYS_FAILURE_COMPLETE // NULL_PTR // OVERRIDE // " 
    });

    return pixels;
  }, []);

  const updateMeltdown = (val: number) => {
    const clamped = Math.min(1, Math.max(0, val));
    meltdownRef.current = clamped;
    
    if (corruptionRef.current) {
      if (clamped > 0.005) {
        corruptionRef.current.style.opacity = "1";
        corruptionRef.current.style.setProperty('--meltdown', clamped.toString());
      } else {
        corruptionRef.current.style.opacity = "0";
        corruptionRef.current.style.setProperty('--meltdown', "0");
      }
    }

    console.log(
      `%c[MELTDOWN ENGINE] Intensity: ${(clamped * 100).toFixed(1)}% | Opacity: ${clamped > 0.005 ? "1" : "0"} | DOM Ref: ${!!corruptionRef.current}`,
      clamped > 0 ? "color: #ff003c; font-weight: bold;" : "color: #888;"
    );
  };

  useEffect(() => {
    console.log("%c[MELTDOWN ENGINE] Initialized on ABOUT ME section", "color: #30D158; font-weight: bold; font-size: 13px;");
    console.log("[MELTDOWN ENGINE] Corruption container attached:", !!corruptionRef.current);
    console.log("[MELTDOWN ENGINE] Total corruption pixels generated:", corruptionPixels.length);

    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // About Me is in view when its top has scrolled to near the top of the viewport
      const isAboutMeInView = rect.top <= 120 && rect.bottom >= window.innerHeight * 0.4;

      if (!isAboutMeInView) {
        if (meltdownRef.current > 0) {
          updateMeltdown(0);
        }
        return;
      }

      // Scrolling down inside About Me drives the cancer corruption forward
      if (e.deltaY > 0) {
        if (meltdownRef.current < 1) {
          e.preventDefault();
          const step = (e.deltaY * 0.002);
          updateMeltdown(meltdownRef.current + step);
        }
      } 
      // Scrolling up recedes the corruption back to 0
      else if (e.deltaY < 0) {
        if (meltdownRef.current > 0) {
          e.preventDefault();
          const step = (e.deltaY * 0.002);
          updateMeltdown(meltdownRef.current + step);
        }
        // Once meltdown reaches 0, normal wheel events naturally scroll back up to Projects!
      }
    };

    // Mobile touch gestures
    let lastTouchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isAboutMeInView = rect.top <= 120 && rect.bottom >= window.innerHeight * 0.4;
      if (!isAboutMeInView) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;

      if (deltaY > 0 && meltdownRef.current < 1) {
        e.preventDefault();
        updateMeltdown(meltdownRef.current + deltaY * 0.004);
      } else if (deltaY < 0 && meltdownRef.current > 0) {
        e.preventDefault();
        updateMeltdown(meltdownRef.current + deltaY * 0.004);
      }
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // If user has scrolled back up towards Projects, reset meltdown
      if (rect.top > 200 && meltdownRef.current > 0) {
        updateMeltdown(0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [corruptionPixels]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center py-32 overflow-hidden z-50"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }}
    >
      
      {/* MASSIVE TYPOGRAPHY */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-[12vw] md:text-[8vw] font-black tracking-tighter text-[#1D1D1F] uppercase mb-12"
      >
        About Me
      </motion.h2>

      {/* THE TARGET: CORPORATE PORTRAIT */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="relative w-[85vw] md:w-[45vw] max-w-[600px] aspect-square mb-8 flex items-center justify-center z-10"
      >
        <img 
          src="/headshot.png" 
          alt="Siddhant Bansod" 
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* CLINICAL TELEMETRY BIO */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col items-center gap-3 font-mono text-xs md:text-sm text-[#86868B] tracking-widest uppercase text-center px-6 mt-4"
      >
        <p><span className="text-[#1D1D1F] font-bold">SYS.ARCH:</span> Full-Stack &amp; Machine Learning</p>
        <p><span className="text-[#1D1D1F] font-bold">HARDWARE:</span> Physical Telemetry &amp; Autonomous Networks</p>
        <p><span className="text-[#1D1D1F] font-bold">OBJECTIVE:</span> Zero-Latency Execution &amp; Structural Efficiency</p>
      </motion.div>

      {/* SHARP MINECRAFT CANCER SPREAD ENGINE (NOW LOCALIZED) */}
      <div 
        ref={corruptionRef}
        suppressHydrationWarning
        // Changed to absolute to lock it to the parent section
        className="absolute inset-0 pointer-events-none z-[50] overflow-hidden transition-opacity duration-75"
        style={{ opacity: 0 }}
      >
        {corruptionPixels.map((p) => (
          <div
            key={p.id}
            className="absolute bg-black text-[#ff003c] font-mono leading-none flex items-start justify-start overflow-hidden break-all select-none"
            style={{
              // Converted to percentages to bind strictly to the About Me container dimensions
              left: `${p.x}%`, 
              top: `${p.y}%`, 
              width: p.isFinal ? '100%' : `${p.size}vw`, 
              height: p.isFinal ? '100%' : `${p.size}vw`, 
              fontSize: p.isFinal ? "16px" : "10px",
              opacity: `clamp(0, calc((var(--meltdown, 0) - ${p.threshold}) * 9999), 1)`
            }}
          >
            {/* INCREASED REPETITION TO PREVENT EMPTY BLACK VOIDS ON 4K MONITORS */}
            {p.code.repeat(p.isFinal ? 2000 : 15)}
          </div>
        ))}
      </div>

    </section>
  );
}
