import { motion, MotionValue } from "framer-motion";

interface YeezusDiscProps {
  onMouseEnter?: () => void;
  rotation?: MotionValue<number>;
  activeProject: { id: string; stack: string; status: string; code: string };
}

export default function CDCenterpiece({ onMouseEnter, rotation, activeProject }: YeezusDiscProps) {
  return (
    <motion.div 
      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[55%] w-[85vw] aspect-square z-30 pointer-events-auto drop-shadow-[25px_35px_0px_rgba(0,0,0,0.95)] flex justify-center items-center"
      onMouseEnter={onMouseEnter}
      style={{ rotate: rotation }}
    >
      {/* PHYSICAL ENGINEERING SCRAP (Now tied to disc rotation) */}
      <div className="absolute bottom-[20vh] left-[25vw] w-[25vw] h-[35vh] bg-[#111315] border border-[#2a2d31] z-20 transform -rotate-6 drop-shadow-[10px_15px_0px_rgba(5,5,5,0.9)] p-4 flex flex-col justify-between"
        style={{
          clipPath: "polygon(0% 0%, 95% 4%, 100% 95%, 5% 100%)",
          backgroundImage: "linear-gradient(rgba(0, 180, 216, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 216, 0.05) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      >
        <div className="font-mono text-[0.7rem] text-[#00B4D8] opacity-80">
          <p className="font-bold border-b border-[#00B4D8]/30 pb-1 mb-1">PROJECT: {activeProject.id}</p>

          <p className="text-[#C77DFF]">STACK: {activeProject.stack}</p>
        </div>
        
        <div className="w-full h-24 border border-[#00B4D8]/40 bg-[#00B4D8]/5 mt-2 flex items-center justify-center">
          {/* You can swap this for actual images based on the project later */}
          <span className="font-mono text-[#00B4D8] text-[0.6rem] opacity-60">LINK_DATA_STREAM</span>
        </div>
        
        <div className="font-mono text-[0.6rem] text-[#FFB703] text-right mt-2 font-bold tracking-widest">
          STATUS: {activeProject.status}
        </div>
      </div>

      <motion.img 
        src="/yeezus-cd.webp" 
        alt="Centerpiece Disc" 
        className="w-full h-auto object-contain z-30 relative"
      />
    </motion.div>
  );
}
