"use client";

import { motion, MotionValue } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  heroY: MotionValue<string>;
  heroOpacity: MotionValue<number>;
  heroScale: MotionValue<number>;
  heroBlur: MotionValue<string>;
}

export default function HeroSection({ 
  heroY, 
  heroOpacity, 
  heroScale, 
  heroBlur 
}: HeroSectionProps) {
  return (
    <motion.section 
      style={{ y: heroY, opacity: heroOpacity, scale: heroScale, filter: heroBlur }}
      className="fixed top-0 left-0 flex flex-col items-center justify-start min-h-screen w-full p-6 text-center bg-white z-20 origin-top shadow-sm"
    >
      <div className="flex flex-col items-center space-y-6 md:space-y-8 pt-[20vh]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-24 md:w-32 md:h-32 bg-neutral-50 rounded-full flex items-center justify-center mb-4 md:mb-8 border border-neutral-200 text-neutral-400 shadow-sm"
        >
          Logo
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-4xl lg:text-5xl tracking-[0.3em] text-neutral-600 font-serif font-light"
        >
          國立政治大學
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-[1px] h-12 md:h-20 bg-neutral-400 transform rotate-[25deg] my-4" 
        />
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-8xl tracking-[0.2em] font-medium text-neutral-900 font-serif"
        >
          附屬高級中學
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} 
          className="flex flex-col items-center animate-bounce text-neutral-400"
        >
          <span className="text-[10px] tracking-widest mb-2 uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.section>
  );
}