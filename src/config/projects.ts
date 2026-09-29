export interface ProjectConfig {
  id: string;
  type: string;
  stack: string[];
  description: string;
  assets: string[];
}

export const PROJECT_REGISTRY: ProjectConfig[] = [
  {
    id: "NEXUSDESK",
    type: "SYSTEM_ARCHITECTURE",
    stack: ["React", "TypeScript", "Tailwind"],
    description: "High-performance operational dashboard engineered for zero-latency data mutation.",
    assets: ["/nexus-1.jpg", "/nexus-2.jpg"] // Placeholders for the clean room UI
  },
  // Future projects drop in here
];
