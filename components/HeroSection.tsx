"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Kiwi_Maru } from "next/font/google";

const hachiMaruPop = Kiwi_Maru({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) {
      document.body.style.overflow = "auto";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 10) setIsVisible(false);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (touchStartY - touchEndY > 20) setIsVisible(false);
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section 
          exit={{ 
            y: "-100vh", 
            opacity: 0, 
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed top-0 left-0 flex flex-col items-center justify-start min-h-screen w-full p-6 text-center bg-white z-50 origin-top overflow-hidden"
        >
          {/* --- FAINT BACKGROUND IMAGE --- */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"> 
            {/* Adjust opacity above: 
               0.05 is very faint (5%), 0.1 is subtle (10%) 
            */}
            <Image
              src="/header_pic.jpg" // Put your image in the /public folder
              alt="Background"
              fill
              className="object-cover" // Grayscale keeps it professional
              priority
            />
          </div>

          {/* --- CONTENT LAYER --- */}
          <div className="relative z-10 flex flex-col items-center space-y-6 md:space-y-8 pt-[20vh]">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-32 h-32 md:w-48 md:h-48 bg-white/50 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mb-4 md:mb-8 border border-neutral-200 shadow-sm overflow-hidden"
            >
              <Image
                src="/icon.jpg" 
                alt="School Logo"
                fill
                className="object-cover rounded-[2rem] md:rounded-[2.5rem]" 
                priority
              />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl md:text-4xl lg:text-5xl tracking-[0.3em] text-neutral-600"
            >
              國立政治大學附屬高級中學
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-[1px] h-12 md:h-20 bg-neutral-400 transform rotate-[25deg] my-4" 
            />
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`${hachiMaruPop.className} text-4xl md:text-6xl lg:text-8xl tracking-[0.2em] text-neutral-900`}
            >
              政大附中<span className="text-2xl md:text-4xl lg:text-5xl">非</span>官方網站
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} 
              className="flex flex-col items-center animate-bounce text-neutral-400"
            >
              <span className="text-[12px] tracking-widest mb-2 uppercase">Scroll</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}