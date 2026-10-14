import fs from "fs";
import path from "path";
import Hero from "@/components/hero/Hero";
import SterileIdentity from "@/components/SterileIdentity";

export default async function Home() {
  const filePath = path.join(process.cwd(), "src", "components", "hero", "Hero.tsx");
  let rawCode = "";
  try {
    rawCode = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    rawCode = "// Error reading source layer. The void is empty.";
  }

  return (
    <main className="relative w-full flex flex-col bg-[#f5f5f7] overflow-x-hidden max-w-[100vw]">
      {/* PHASE 1 & 2: The Void & The Projects Timeline */}
      <Hero rawCode={rawCode} />
      
      {/* PHASE 3: The Sterile Identity (Full Viewport Section) */}
      <div className="relative z-50 w-full bg-[#f5f5f7]">
        <SterileIdentity />
      </div>
      
    </main>
  );
}
