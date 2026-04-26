"use client";

import { useState } from "react";
import { motion, Variants, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import dynamic from 'next/dynamic';
import HeroSection from "@/components/HeroSection";
import NavigationMenu from "@/components/NavigationMenu";

// Optimization: Dynamically import components below the fold or reliant on heavy fetching
const AnnouncementSection = dynamic(() => import("@/components/AnnouncementSection"), { ssr: false });
const ZonesSection = dynamic(() => import("@/components/ZonesSection"));
const CalendarSection = dynamic(() => import("@/components/CalendarSection"), { ssr: false });

const categories = ["全校", "高三", "高二", "高一", "國三", "國二", "國一"];

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

  const [selectedCategory, setSelectedCategory] = useState("全校");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            <h1 
              className="text-xl font-medium tracking-wide cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              政大附中
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-neutral-900" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </header>

        {/* Navigation Dropdown Menu */}
        <NavigationMenu 
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

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
            <motion.div id="announcements" variants={itemVariants} className="scroll-mt-24 md:col-span-1 lg:col-span-9 flex flex-col">
              <AnnouncementSection selectedCategory={selectedCategory} />
            </motion.div>

            {/* SECTION: Special Zones */}
            <motion.div id="zones" variants={itemVariants} className="scroll-mt-24 md:col-span-1 lg:col-span-3 space-y-4">
              <ZonesSection />
            </motion.div>

            {/* SECTION: Calendar */}
            <motion.div id="calendar" variants={itemVariants} className="scroll-mt-24 md:col-span-1 md:col-start-1 lg:col-span-12">
              <CalendarSection category={selectedCategory} />
            </motion.div>
          </motion.div>
        </main>

        <footer className="p-6 mt-8 border-t border-neutral-200 bg-neutral-50">
          <div className="flex flex-col items-center justify-center space-y-2 text-xs text-neutral-400">
            <p>國立政治大學附屬高級中學 © {new Date().getFullYear()}</p>
            <p>開發者: 林子宸</p>
            <p>協助開發: 鄭宇宸、楊紹玄</p>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}