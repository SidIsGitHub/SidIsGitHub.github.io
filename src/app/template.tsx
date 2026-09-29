"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { VIOLENT_SPRING } from "@/lib/physics";

/**
 * TEMPLATE — NOT LAYOUT
 *
 * template.tsx re-mounts on every route change.
 * This triggers AnimatePresence exit/enter animations.
 * layout.tsx persists across routes and would swallow the animation.
 *
 * The transition is a violent white flash → hard cut.
 * No fade. No slide. Pure aggression.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          filter: "brightness(5) contrast(3)",
        }}
        animate={{
          opacity: 1,
          filter: "brightness(1) contrast(1)",
        }}
        exit={{
          opacity: 0,
          filter: "brightness(5) contrast(3)",
        }}
        transition={{
          type: "spring",
          ...VIOLENT_SPRING,
          opacity: { duration: 0.15 },
        }}
        className="flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
