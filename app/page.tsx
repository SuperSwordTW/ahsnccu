"use client";

import { useState } from "react";
import { motion, Variants, useScroll, useTransform, useSpring } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu } from "lucide-react"; // Removed ChevronDown
import AnnouncementSection from "@/components/AnnouncementSection";
import HeroSection from "@/components/HeroSection";
import ZonesSection from "@/components/ZonesSection";

const categories = ["全部公告", "國一", "國二", "國三", "高一", "高二", "高三"];

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

  const [selectedCategory, setSelectedCategory] = useState("全部公告");

  return (
    <div className="flex flex-col w-full bg-neutral-100 relative min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <HeroSection />

      {/* --- MAIN CONTENT --- */}
      <motion.div 
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
            {categories.map((item, i) => (
              <Button 
                key={i} 
                variant={item === selectedCategory ? "default" : "outline"} 
                onClick={() => setSelectedCategory(item)}
                className={`rounded-full shrink-0 ${item === selectedCategory ? 'bg-neutral-900 text-white' : 'text-neutral-600 border-neutral-200'}`}
              >
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
              <AnnouncementSection selectedCategory={selectedCategory} />
            </motion.div>

            {/* SECTION: Special Zones */}
            <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-3 space-y-4">
              <ZonesSection />
            </motion.div>
          </motion.div>
        </main>

        <footer className="p-6 mt-8 border-t border-neutral-200 bg-neutral-50">
          <div className="flex flex-col items-center justify-center space-y-2 text-xs text-neutral-400">
            <p>國立政治大學附屬高級中學 © {new Date().getFullYear()}</p>
            <p>開發者: 林子宸、鄭宇宸、鄭宇翔、楊紹玄</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}