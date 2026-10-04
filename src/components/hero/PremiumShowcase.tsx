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
      className="w-[60vw] shrink-0"
      style={{
        scale: cardScale,
        opacity: cardOpacity,
        filter: cardFilter,
      }}
    >
      {/* ── Card Surface ── */}
      <div className="relative rounded-[32px] bg-white/40 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
        
        {/* ── Image Region ── */}
        <div className="relative h-[38vh] md:h-[44vh] overflow-hidden">
          <motion.div
            className={`absolute inset-0 ${project.imagePlaceholder}`}
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
  // Explicit Track X translation mapping tied perfectly to card checkpoints
  // Enforces the 20-degree buffer. Track does not move until 160°.
  // Step size is exactly 65vw (60vw card + 5vw gap). 
  // 0, -65, -130, -195
  const trackX = useTransform(
    rotation, 
    [160, 230, 300, 370], 
    ["0vw", "-65vw", "-130vw", "-195vw"] 
  );

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      


      {/* ── Horizontal Track ── */}
      <div className="flex-1 relative flex items-center overflow-visible">
        <motion.div
          className="flex items-center gap-[5vw] pl-[20vw] pr-[20vw] w-max h-full"
          style={{ x: trackX }}
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
