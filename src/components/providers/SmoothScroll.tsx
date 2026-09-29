"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * SMOOTH SCROLL PROVIDER
 *
 * This scroll should feel like dragging through tar.
 * Deliberately heavy, deliberately slow.
 * The weight is the point.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,
        duration: 1.8,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
