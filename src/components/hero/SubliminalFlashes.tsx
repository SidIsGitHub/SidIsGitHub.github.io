import { useState } from "react";
import { useMotionValueEvent, MotionValue } from "framer-motion";

const SUBLIMINAL_ASSETS = [
  "/subliminal/alley.jpeg",
  "/subliminal/fish.jpeg",
  "/subliminal/gkmc.jpeg",
  "/subliminal/india.jpeg",
  "/subliminal/painting1.jpeg",
  "/subliminal/painting2.jpeg",
  "/subliminal/painting3.jpeg",
  "/subliminal/sid1.jpeg",
  "/subliminal/sid2.jpeg",
  "/subliminal/story.jpeg"
];

export function SubliminalFlashes({ velocity, rotation }: { velocity: MotionValue<number>; rotation: MotionValue<number> }) {
  const [flash, setFlash] = useState<{ src: string; x: number; y: number; scale: number; rotate: number } | null>(null);

  useMotionValueEvent(velocity, "change", (latestVelocity) => {
    // Only trigger on very fast scroll (velocity magnitude > 800) and in Brutalist state
    if (Math.abs(latestVelocity) > 800 && rotation.get() < 90) {
      // 40% chance to trigger so it's unpredictable
      if (Math.random() > 0.6 && !flash) {
        const maxX = typeof window !== 'undefined' ? window.innerWidth - 300 : 1000;
        const maxY = typeof window !== 'undefined' ? window.innerHeight - 300 : 800;

        setFlash({
          src: SUBLIMINAL_ASSETS[Math.floor(Math.random() * SUBLIMINAL_ASSETS.length)],
          x: Math.random() * maxX,
          y: Math.random() * maxY,
          scale: 0.8 + Math.random() * 1.5, // Warp the size
          rotate: (Math.random() - 0.5) * 25 // Slight harsh tilt
        });

        // Subliminal unmount: Exists for 180-200ms
        setTimeout(() => {
          setFlash(null);
        }, 180 + Math.random() * 20);
      }
    }
  });

  if (!flash) return null;

  return (
    <div 
      className="fixed z-[9999] pointer-events-none opacity-100 flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-[var(--y)] md:left-[var(--x)] md:translate-x-0 md:translate-y-0"
      style={{
        '--x': `${flash.x}px`,
        '--y': `${flash.y}px`,
        transform: `scale(${flash.scale}) rotate(${flash.rotate}deg)`,
      } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={flash.src} 
        alt="subliminal flash" 
        className="object-contain w-[80vw] max-w-[280px] md:w-[35vw] md:max-w-none h-auto shadow-2xl" 
      />
    </div>
  );
}
