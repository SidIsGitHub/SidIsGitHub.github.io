import fs from "fs";
import path from "path";
import Hero from "@/components/hero/Hero";

export default async function Home() {
  const filePath = path.join(process.cwd(), "src", "components", "hero", "Hero.tsx");
  let rawCode = "";
  try {
    rawCode = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    rawCode = "// Error reading source layer. The void is empty.";
  }

  return (
    <main className="relative">
      <Hero rawCode={rawCode} />

      {/* End spacer — provides scroll real estate for disc physics */}
      <section className="relative h-screen bg-black flex items-center justify-center">
        <div
          className="font-[family-name:var(--font-code)] text-[clamp(2rem,8vw,6rem)] font-bold uppercase tracking-tighter text-center"
          style={{ mixBlendMode: "difference", color: "#ffffff" }}
        >
          MORE COMING
        </div>
      </section>
    </main>
  );
}
