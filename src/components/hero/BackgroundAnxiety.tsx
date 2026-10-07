export function BackgroundAnxiety() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden z-0 pointer-events-none">
      
      {/* LAYER 1: THE DISTORTED PHOTOGRAPHIC ASSET */}
      <div 
        className="absolute inset-0 w-full h-full opacity-85 mix-blend-luminosity grayscale contrast-125"
        style={{
          backgroundImage: 'url("/distorted-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* LAYER 2: DEEP VIGNETTE & CRUSHED SHADOWS */}
      {/* This ensures the edges fall off into pure black, focusing the user on the CD and masking the hard edges of the image */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000000_110%)] opacity-90 mix-blend-multiply" />
      
      {/* LAYER 3: SUBTLE CRT SCANLINE TEXTURE (OPTIONAL DEPTH) */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 4px)',
        }}
      />
      
      {/* LAYER 4: MINIMAL DATA HUD */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-1 opacity-60 mix-blend-difference">
         <div className="flex items-end gap-[2px]">
           {[...Array(18)].map((_, i) => (
              <div key={i} className={`bg-[#E8E8E6] ${i % 4 === 0 ? 'h-12 w-[3px]' : 'h-8 w-[1px]'}`}></div>
           ))}
         </div>
         <span className="font-mono text-[10px] font-bold text-[#E8E8E6] tracking-widest mt-1">SYS.OVERRIDE.X9</span>
      </div>

    </div>
  );
}
