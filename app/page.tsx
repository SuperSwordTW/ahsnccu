"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, Variants, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card"; // Removed CardContent since we won't need it on the outer card
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChevronRight, Menu, ChevronDown, Search, Paperclip, Loader2, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Setup ---
// In a real app, you'd usually import this from a central lib/supabase.ts file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Types ---
type Announcement = {
  id: string;
  time: string; // or created_at
  unit: string;
  title: string;
  content: string;
  attached_file_link?: string;
  tag?: string; // Optional: if you still use tags
};

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

  // --- State for Announcements & Search ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("time", { ascending: false }); // Sort by newest first

      if (error) {
        console.error("Error fetching announcements:", error);
      } else if (data) {
        setAnnouncements(data);
      }
      setIsLoading(false);
    };

    fetchAnnouncements();
  }, []);

  // Smart Search Logic
  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    
    // Split query by spaces to allow multi-word fuzzy matching (e.g., "教務處 模擬考")
    const searchTerms = searchQuery.toLowerCase().split(/\s+/);
    
    return announcements.filter((item) => {
      // Combine all searchable text into one string
      const searchableText = `${item.title} ${item.content || ""} ${item.unit}`.toLowerCase();
      
      // Ensure EVERY search term exists SOMEWHERE in the text
      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [announcements, searchQuery]);

  return (
    <div className="flex flex-col w-full bg-neutral-100 relative min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale, filter: heroBlur }}
        className="fixed top-0 left-0 flex flex-col items-center justify-center min-h-screen w-full p-6 text-center bg-white z-20 origin-top shadow-sm"
      >
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
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
          </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute bottom-12 flex flex-col items-center animate-bounce text-neutral-400">
          <span className="text-[10px] tracking-widest mb-2 uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.section>

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
            <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-9 space-y-4">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between px-1 gap-4">
                <h2 className="text-lg font-medium flex items-center gap-2 text-neutral-800 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-neutral-400" /> 最新公告
                </h2>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="搜尋公告、處室或關鍵字..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-4 rounded-full bg-neutral-100 border-transparent text-sm focus:border-neutral-300 focus:bg-white focus:ring-0 transition-all outline-none"
                  />
                </div>
              </div>
              
              {/* Data Loading / Empty State / Render List */}
              <div className="space-y-4 pt-2">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <p className="text-sm">載入公告中...</p>
                  </div>
                ) : filteredAnnouncements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                    <p className="text-sm">找不到符合「{searchQuery}」的公告</p>
                  </div>
                ) : (
                  filteredAnnouncements.map((item) => (
                    <Card 
                      key={item.id} 
                      className="border-neutral-200 rounded-2xl shadow-none hover:bg-neutral-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAnnouncement(item)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-2">
                            {item.tag && <span className="text-[10px] border border-neutral-300 px-2 py-0.5 rounded-sm text-neutral-500">{item.tag}</span>}
                            <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded-sm text-neutral-500">{item.unit}</span>
                          </div>
                          <span className="text-xs text-neutral-400">
                            {new Date(item.time).toLocaleDateString('zh-TW')}
                          </span>
                        </div>
                        <CardTitle className="text-base leading-snug text-neutral-800">{item.title}</CardTitle>
                        
                        {/* Indicate if there's an attachment without showing the direct link */}
                        {item.attached_file_link && (
                           <div className="flex items-center text-xs text-neutral-400 mt-2">
                             <Paperclip className="w-3 h-3 mr-1" /> 含附件
                           </div>
                        )}
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
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
      {/* --- POP-UP MODAL --- */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/30 backdrop-blur-sm">
            {/* Background click listener to close */}
            <div className="absolute inset-0" onClick={() => setSelectedAnnouncement(null)} />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-2">
                    {selectedAnnouncement.tag && <span className="text-xs border border-neutral-300 px-2 py-0.5 rounded-sm text-neutral-500">{selectedAnnouncement.tag}</span>}
                    <span className="text-xs bg-neutral-100 px-2 py-0.5 rounded-sm text-neutral-500">{selectedAnnouncement.unit}</span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {new Date(selectedAnnouncement.time).toLocaleDateString('zh-TW')}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedAnnouncement(null)} 
                  className="p-2 bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-medium text-neutral-900 mb-6 leading-snug">
                {selectedAnnouncement.title}
              </h3>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto pr-2 mb-4 scrollbar-hide">
                <p className="text-sm md:text-base text-neutral-600 whitespace-pre-wrap leading-relaxed">
                  {selectedAnnouncement.content || "此公告無詳細內容。"}
                </p>
              </div>

              {/* Footer / Action Button */}
              {selectedAnnouncement.attached_file_link && (
                <div className="pt-4 border-t border-neutral-100 mt-auto">
                  <Button className="w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 h-12" asChild>
                    <a href={selectedAnnouncement.attached_file_link} target="_blank" rel="noopener noreferrer">
                      <Paperclip className="w-4 h-4 mr-2" />
                      查看附件 <ArrowUpRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}