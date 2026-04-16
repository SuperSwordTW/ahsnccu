"use client";

import { motion, Variants, useScroll, useTransform, useSpring } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu } from "lucide-react"; // Removed ChevronDown
import AnnouncementSection from "@/components/AnnouncementSection";
import HeroSection from "@/components/HeroSection"; // <-- Import your new component

const zones = [
  "新生專區", "升學專區", "獎助學金專區", "線上請假專區", 
  "停課不停學專區", "防治校園霸凌專區", "資通安全維護專區"
];

// --- Animations ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function MobileFrontPage() {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 20, restDelta: 0.001 });
  
  const heroY = useTransform(smoothY, [0, 350], ["0%", "-100%"]);
  const heroOpacity = useTransform(smoothY, [0, 250], [1, 0]);
  const heroScale = useTransform(smoothY, [0, 350], [1, 0.92]);
  const heroBlur = useTransform(smoothY, [0, 300], ["blur(0px)", "blur(12px)"]);
  const contentY = useTransform(smoothY, [0, 400], [80, 0]);

  return (
    <div className="flex flex-col w-full bg-neutral-100 relative min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <HeroSection 
        heroY={heroY} 
        heroOpacity={heroOpacity} 
        heroScale={heroScale} 
        heroBlur={heroBlur} 
      />

      {/* --- SCROLL SPACER --- */}
      <div className="w-full h-[85vh]" />

      {/* --- MAIN CONTENT --- */}
      <motion.div 
        style={{ y: contentY }}
        className="relative z-10 w-full bg-white rounded-t-[40px] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] min-h-screen flex flex-col"
      >
        <header className="sticky top-0 z-30 w-full flex items-center justify-between p-5 md:px-10 bg-white/80 backdrop-blur-md border-b border-neutral-100 rounded-t-[40px]">
          <div className="flex flex-col">
            <span className="text-xs tracking-widest text-neutral-500 mb-1">國立政治大學</span>
            <h1 className="text-xl font-medium tracking-wide">附屬高級中學</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-neutral-900">
            <Menu className="w-6 h-6" />
          </Button>
        </header>

        <main className="flex-1 p-4 md:px-8 md:py-10 space-y-8 w-full pt-8">
          
          <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["公告", "國/高中資訊", "專區"].map((item, i) => (
              <Button key={i} variant={i === 0 ? "default" : "outline"} className={`rounded-full shrink-0 ${i===0 ? 'bg-neutral-900 text-white' : 'text-neutral-600 border-neutral-200'}`}>
                {item}
              </Button>
            ))}
          </nav>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12"
          >
            {/* SECTION: Announcements */}
            <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-9 flex flex-col">
              <AnnouncementSection />
            </motion.div>

            {/* SECTION: Special Zones */}
            <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between px-1 mt-4 md:mt-0">
                <h2 className="text-lg font-medium flex items-center gap-2 text-neutral-800">
                  <span className="w-2 h-2 rounded-none bg-neutral-400 transform rotate-45" /> 常用專區
                </h2>
              </div>
              
              <Card className="border-neutral-200 rounded-2xl shadow-none overflow-hidden">
                <div className="flex flex-col divide-y divide-neutral-100">
                  {zones.slice(0, 5).map((zone, idx) => (
                    <button key={idx} className="flex items-center justify-between p-4 text-sm text-left hover:bg-neutral-50 transition-colors text-neutral-700">
                      {zone}
                      <ChevronRight className="w-4 h-4 text-neutral-300" />
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </main>

        <footer className="p-6 mt-8 border-t border-neutral-200 bg-neutral-50">
          <div className="flex flex-col items-center justify-center space-y-2 text-xs text-neutral-400">
            <p>國立政治大學附屬高級中學 © {new Date().getFullYear()}</p>
            <p>開發者: 林子宸、鄭宇宸、鄭宇翔</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}