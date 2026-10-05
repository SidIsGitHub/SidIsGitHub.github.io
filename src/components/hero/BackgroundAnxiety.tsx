export function BackgroundAnxiety() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#E8E8E6] pointer-events-none overflow-hidden z-0">
      {/* Heavy Paper Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.4] mix-blend-multiply"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />
    </div>
  );
}
