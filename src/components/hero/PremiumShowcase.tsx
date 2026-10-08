"use client";

import { motion, useTransform, MotionValue } from "framer-motion";

// ─────────────────────────────────────────────
// DATA MODEL
// ─────────────────────────────────────────────

type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  metrics: string[];
  imagePlaceholder: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "FLUXX",
    category: "Autonomous Aerial Systems",
    description:
      "AI-powered flying-wing drone network engineered for zero-latency telemetry and disaster prevention.",
    metrics: ["SolidWorks", "ESP32", "OpenCV"],
    imagePlaceholder: "bg-gradient-to-br from-[#e8e8ed] to-[#d2d2d7]",
  },
  {
    id: "02",
    title: "MediPanda",
    category: "Diagnostic Backend",
    description:
      "High-performance AI backend for OCR medical report processing and nutritional context management.",
    metrics: ["FastAPI", "Supabase", "Gemini AI"],
    imagePlaceholder: "bg-gradient-to-br from-[#d2d2d7] to-[#b0b0b5]",
  },
  {
    id: "03",
    title: "Entropy",
    category: "Physical Computing",
    description:
      "Hardware-based visual entropy random password generator utilizing custom fluid dynamics.",
    metrics: ["Hardware", "C++", "Sensors"],
    imagePlaceholder: "bg-gradient-to-br from-[#e0e0e5] to-[#c0c0c5]",
  },
  {
    id: "04",
    title: "Squad House",
    category: "Mobile Booking App",
    description:
      "High-conversion iOS/Android booking application with automated spreadsheet synchronization and digital wallet integration.",
    metrics: ["Flutter", "Google Sheets", "Wallet System"],
    imagePlaceholder: "bg-gradient-to-br from-[#c8c8cf] to-[#b0b0b5]",
  },
];

// ─────────────────────────────────────────────
// PROJECT CARD
// ─────────────────────────────────────────────

function ProjectCard({
  project,
  index,
  rotation,
}: {
  project: Project;
  index: number;
  rotation: MotionValue<number>;
}) {
  // Checkpoint Physics: Exact rotational sweet spots per card
  // Card 1: 160°, Card 2: 230°, Card 3: 300°, Card 4: 370°
  const sweetSpot = 160 + index * 70;

  // Visual interpolations based on distance from sweet spot
  const cardScale = useTransform(rotation, [sweetSpot - 70, sweetSpot, sweetSpot + 70], [0.85, 1, 0.85]);
  const cardOpacity = useTransform(rotation, [sweetSpot - 70, sweetSpot, sweetSpot + 70], [0.3, 1, 0.3]);
  const cardBlur = useTransform(rotation, [sweetSpot - 70, sweetSpot, sweetSpot + 70], [8, 0, 8]);
  const cardFilter = useTransform(cardBlur, (b) => `blur(${b}px)`);

  // Internal image parallax — shifts the image opposite to scroll direction
  const imageX = useTransform(rotation, [sweetSpot - 60, sweetSpot + 60], [20, -20]);

  return (
    <motion.div
      className="relative w-[90vw] max-w-[400px] md:w-[60vw] md:max-w-none shrink-0"
      style={{
        scale: cardScale,
        opacity: cardOpacity,
        filter: cardFilter,
      }}
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* ── Card Surface ── */}
      <div className="relative bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden">
        {/* INNER SPECULAR HIGHLIGHT */}
        <div className="absolute inset-0 border border-white/40 rounded-[32px] pointer-events-none mix-blend-overlay z-50"></div>
        
        {/* ── Image Region ── */}
        <div className="relative h-[38vh] md:h-[44vh] overflow-hidden">
          <motion.div
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#f5f5f7] via-[#ebebef] to-[#d1d1d6]"
            style={{ x: imageX }}
          >
            {/* Architectural grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(to right, #000 0px, #000 1px, transparent 1px, transparent 48px),
                  repeating-linear-gradient(to bottom, #000 0px, #000 1px, transparent 1px, transparent 48px)
                `,
              }}
            />
            {/* Centered monogram */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12vw] md:text-[7vw] font-black text-black/[0.04] tracking-tighter select-none">
                {project.title}
              </span>
            </div>
          </motion.div>

          {/* Top-left floating index badge */}
          <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-2 border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <span className="font-mono text-xs font-semibold text-[#1D1D1F] tracking-widest">
              {project.id}
            </span>
          </div>
        </div>

        {/* ── Content Region ── */}
        <div className="px-8 md:px-10 py-8 md:py-10">
          {/* Category micro-label */}
          <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-[#86868B] uppercase mb-3">
            {project.category}
          </p>

          {/* Title */}
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#1D1D1F] mb-4 leading-[1.1]">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-[15px] md:text-base leading-relaxed text-[#6e6e73] mb-8 max-w-[48ch]">
            {project.description}
          </p>

          {/* Metric pills */}
          <div className="flex flex-wrap gap-2">
            {project.metrics.map((metric) => (
              <span
                key={metric}
                className="px-4 py-[6px] rounded-full text-xs font-semibold tracking-wide bg-white/60 backdrop-blur-md text-[#1D1D1F] border border-black/[0.04]"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PREMIUM SHOWCASE (THE KINETIC RULER)
// ─────────────────────────────────────────────

interface PremiumShowcaseProps {
  rotation: MotionValue<number>;
}

export default function PremiumShowcase({ rotation }: PremiumShowcaseProps) {
  // Explicit Track index mapping tied perfectly to card checkpoints
  // We use an index so we can calculate viewport-relative CSS transforms
  const trackIndex = useTransform(
    rotation, 
    [160, 230, 300, 370], 
    [0, -1, -2, -3] 
  );

  return (
    <div className="absolute inset-0 flex flex-col overflow-x-hidden max-w-[100vw]">
      


      {/* ── Horizontal Track ── */}
      <div className="flex-1 relative flex items-start md:items-center overflow-visible w-full max-w-[100vw]">
        <motion.div
          className="flex flex-col md:flex-row items-center gap-[10vh] md:gap-[5vw] px-4 md:px-0 md:pl-[20vw] md:pr-[20vw] w-full md:w-max md:max-w-none pt-[15vh] md:pt-0 max-md:[transform:translateY(calc(var(--track-idx)*75vh))] md:[transform:translateX(calc(var(--track-idx)*65vw))]"
          style={{ '--track-idx': trackIndex } as React.CSSProperties}
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              rotation={rotation}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
