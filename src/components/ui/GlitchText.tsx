"use client";

import { motion, useSpring, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
  as?: "h1" | "h2" | "h3" | "span" | "p" | "div";
}

const intensityConfig = {
  low: { jitterRange: 1, flickerInterval: 3000, skewRange: 0.3 },
  medium: { jitterRange: 3, flickerInterval: 1500, skewRange: 1 },
  high: { jitterRange: 6, flickerInterval: 500, skewRange: 2 },
};

/**
 * GLITCH TEXT
 *
 * Brutalist typography that refuses to sit still.
 * Random position jitters, opacity flickers, skew distortion.
 * Every instance is uniquely unstable.
 */
export default function GlitchText({
  text,
  className = "",
  intensity = "medium",
  as: Tag = "span",
}: GlitchTextProps) {
  const config = intensityConfig[intensity];
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const skewX = useMotionValue(0);
  const opacity = useMotionValue(1);

  const springX = useSpring(x, { stiffness: 400, damping: 8 });
  const springY = useSpring(y, { stiffness: 400, damping: 8 });
  const springSkew = useSpring(skewX, { stiffness: 300, damping: 12 });

  useEffect(() => {
    const jitter = () => {
      const range = config.jitterRange;
      x.set((Math.random() - 0.5) * range * 2);
      y.set((Math.random() - 0.5) * range * 2);
      skewX.set((Math.random() - 0.5) * config.skewRange * 2);

      // Random opacity flicker
      if (Math.random() > 0.85) {
        opacity.set(Math.random() * 0.4 + 0.1);
        setTimeout(() => opacity.set(1), 50 + Math.random() * 100);
      }
    };

    intervalRef.current = setInterval(jitter, config.flickerInterval);

    // Initial jitter
    jitter();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [config, x, y, skewX, opacity]);

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      style={{
        x: springX,
        y: springY,
        skewX: springSkew,
        opacity,
      }}
      className={`select-none font-[family-name:var(--font-brutalist)] leading-none tracking-tighter ${className}`}
    >
      {text}
    </MotionTag>
  );
}
