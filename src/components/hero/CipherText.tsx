"use client";

import { useState, useEffect } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";

export function CipherText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }
    
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) => 
        prev.split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3; 
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  // Apply violent RGB splitting only when hovering
  const rgbShadow = isHovered 
    ? "5px 0px 0px rgba(255,0,0,0.8), -5px 0px 0px rgba(0,255,255,0.8)" 
    : "none";

  return (
    <span 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-block transition-all duration-75 cursor-crosshair"
      style={{ textShadow: rgbShadow }}
    >
      {displayText}
    </span>
  );
}
