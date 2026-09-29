import { motion } from "framer-motion";

export function BackgroundAnxiety() {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden opacity-15 mix-blend-difference" 
      style={{ perspective: '1200px' }}
    >
      {/* Master Rotation Node (The Outer Hyper-Structure) */}
      <motion.div 
        className="relative w-[50vw] h-[50vw] flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, -360] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        
        {/* Inner Core (Rotates inversely to the outer structure) */}
        <motion.div 
          className="absolute w-[25vw] h-[25vw] border border-[#EBEBEB]"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateX: [0, -360], rotateY: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
           {/* Inner Intersecting Axes */}
           <div className="absolute inset-0 border border-[#EBEBEB]" style={{ transform: 'rotateX(90deg)' }} />
           <div className="absolute inset-0 border border-[#EBEBEB]" style={{ transform: 'rotateY(90deg)' }} />
           <div className="absolute inset-0 border border-[#EBEBEB]" style={{ transform: 'rotateZ(90deg) rotateX(45deg)' }} />
        </motion.div>
        
        {/* Outer Shell (A cage of 8 intersecting planes) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-full h-full border border-[#EBEBEB]"
            style={{ 
              transform: `rotateX(${i * 22.5}deg) rotateY(${i * 45}deg)`,
              transformStyle: 'preserve-3d' 
            }}
          />
        ))}
        
      </motion.div>
    </div>
  );
}
