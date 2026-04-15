"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight, Menu } from "lucide-react";

// --- Sample Data based on your PDF ---
const announcements = [
  { id: "1", tag: "通用", unit: "訓育組", title: "115 西北高中交流入取名單", date: "2026-04-16" }, // Based on your PDF mockups
  { id: "2", tag: "高三", unit: "教務處", title: "115學年度升學模擬考時程表", date: "2026-04-15" },
];

const zones = [
  "新生專區", "升學專區", "獎助學金專區", "線上請假專區", 
  "停課不停學專區", "防治校園霸凌專區", "資通安全維護專區"
]; // Extracted from page 4 of the PDF

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function MobileFrontPage() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto md:max-w-4xl border-x border-neutral-200 bg-white shadow-sm">
      
      {/* HEADER: Minimalist top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-5 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="flex flex-col">
          <span className="text-xs tracking-widest text-neutral-500 mb-1">國立政治大學</span>
          <h1 className="text-xl font-medium tracking-wide">附屬高級中學</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-neutral-900">
          <Menu className="w-6 h-6" />
        </Button>
      </header>

      {/* MAIN CONTENT: Mobile Bento Stack */}
      <main className="flex-1 p-4 space-y-6">
        
        {/* Navigation Categories */}
        <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["公告", "國/高中資訊", "專區"].map((item, i) => (
            <Button key={i} variant={i === 0 ? "default" : "outline"} className={`rounded-full shrink-0 ${i===0 ? 'bg-neutral-900 text-white' : 'text-neutral-600'}`}>
              {item}
            </Button>
          ))}
        </nav>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          
          {/* SECTION: Announcements */}
          <motion.div variants={itemVariants} className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-400" /> 最新公告
              </h2>
            </div>
            
            {announcements.map((item) => (
              <Card key={item.id} className="border-neutral-200 rounded-2xl shadow-none hover:bg-neutral-50 transition-colors">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex gap-2">
                      <span className="text-[10px] border border-neutral-300 px-2 py-0.5 rounded-sm text-neutral-500">{item.tag}</span>
                      <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-sm text-neutral-500">{item.unit}</span>
                    </div>
                    <span className="text-xs text-neutral-400">{item.date}</span>
                  </div>
                  <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex justify-end">
                  <Button variant="ghost" size="sm" className="h-8 text-neutral-500 hover:text-neutral-900 pr-0">
                    查看詳情 <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* SECTION: Special Zones (專區) */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center justify-between px-1 mt-4 md:mt-0">
              <h2 className="text-lg font-medium flex items-center gap-2">
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

      {/* FOOTER */}
      <footer className="p-6 mt-8 border-t border-neutral-200 bg-neutral-50">
        <div className="flex flex-col items-center justify-center space-y-2 text-xs text-neutral-400">
          <p>國立政治大學附屬高級中學 © {new Date().getFullYear()}</p>
          <p>開發者: 林子宸、鄭宇宸、鄭宇翔</p>
        </div>
      </footer>
    </div>
  );
}