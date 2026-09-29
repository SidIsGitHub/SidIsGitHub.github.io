"use client";

import { motion } from "motion/react";

/**
 * CHAOS LAYER
 *
 * The hostile surface. This is what the world sees first.
 * Flashing backgrounds, intentionally hard to read.
 *
 * The chaos is not random. It is engineered chaos.
 */
export default function ChaosLayer() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Diagonal slash lines — industrial texture */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`slash-${i}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.5 + i * 0.1,
            }}
            className="absolute bg-black origin-left"
            style={{
              height: "2px",
              width: "150%",
              top: `${15 + i * 18}%`,
              left: "-25%",
              transform: `rotate(${-15 + i * 7}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
