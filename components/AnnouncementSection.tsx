"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Search, Paperclip, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Setup ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Types ---
type Attachment = {
  name: string;
  url: string;
};

type Announcement = {
  id: number;
  time: string; 
  unit: string;
  title: string;
  content: string;
  attach_file_link?: Attachment[] | null; 
  imgs_links?: string[] | null;
  is_hot: boolean;
  tag?: string; 
};

const ITEMS_PER_PAGE = 6; // You can change how many items show per page here

const categoryKeywords: Record<string, string[]> = {
  "全校": [], 
  "國一": ["國一", "國中一年級", "七年級", "國中部新生"],
  "國二": ["國二", "國中二年級", "八年級"],
  "國三": ["國三", "國中三年級", "九年級", "會考", "免試入學"],
  "高一": ["高一", "高中一年級", "十年級", "高中部新生"],
  "高二": ["高二", "高中二年級", "十一年級", "選群"],
  "高三": ["高三", "高中三年級", "十二年級", "學測", "分科", "繁星", "個人申請", "個申", "特選", "特殊選材"],
};

interface AnnouncementSectionProps {
  selectedCategory: string;
}

export default function AnnouncementSection({ selectedCategory }: AnnouncementSectionProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Announcement[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchQuery]);
  
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    // Add a slight delay to allow React to render the new list before scrolling
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Fetch from Supabase on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("is_hot", { ascending: false })
        .order("time", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching announcements:", error);
      } else if (data) {
        setAnnouncements(data);
      }
      setIsLoading(false);
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (selectedAnnouncement) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure scrolling is restored if the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedAnnouncement]);

  // Vector Search API Effect
  useEffect(() => {
    const fetchSemanticSearch = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      setIsSearching(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: debouncedQuery, category: selectedCategory }),
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Search failed: ${res.status} - ${errorText}`);
        }
        
        const { data } = await res.json();
        setSearchResults(data || []);
      } catch (error) {
        console.error("Vector search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSemanticSearch();
  }, [debouncedQuery, selectedCategory]);

  // Display Logic: Use API results if searching, otherwise use local category filter
  const filteredAnnouncements = useMemo(() => {
    // If a search query is active, return the AI vector results
    if (debouncedQuery.trim()) {
      return searchResults;
    }

    // Otherwise, default back to the normal local category filter
    let result = announcements;
    if (selectedCategory !== "全校") {
      const keywords = categoryKeywords[selectedCategory] || [selectedCategory];
      result = result.filter((item) => {
        const attachmentNames = item.attach_file_link ? item.attach_file_link.map(a => a.name).join(" ") : "";
        const searchableText = `${item.tag || ""} ${item.title} ${item.content || ""} ${attachmentNames}`.toLowerCase();
        return keywords.some((keyword) => searchableText.includes(keyword.toLowerCase()));
      });
    }

    return result;
  }, [announcements, searchResults, debouncedQuery, selectedCategory]);

  // --- Pagination Logic ---
  // Reset to page 1 whenever the user types a new search query
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <div ref={sectionRef} className="flex flex-col md:flex-row md:items-center justify-between px-1 gap-4 mb-4 scroll-mt-6">
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
      <div className="space-y-4 pt-2 min-h-[600px]">
        {isLoading || isSearching ? (
          <div className="flex flex-col items-center justify-center h-full py-24 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            <p className="text-sm">{isSearching ? "搜尋中..." : "載入公告中..."}</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-sm">
              {searchQuery.trim() 
                ? `找不到符合「${searchQuery}」的公告` 
                : "此分類目前無公告"}
            </p>
          </div>
        ) : (
          <>
            {/* Render ONLY the paginated slice of announcements */}
            {paginatedAnnouncements.map((item) => (
              <Card 
                key={item.id} 
                className="p-0 border-neutral-200 rounded-xl shadow-none hover:bg-neutral-50 transition-colors cursor-pointer"
                onClick={() => setSelectedAnnouncement(item)}
              >
                <CardHeader className="p-2 gap-2 space-y-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex gap-1">
                      {item.tag && (
                        <span className="text-[10px] border border-neutral-200 px-1 py-0.5 rounded text-neutral-500 leading-none">
                          {item.tag}
                        </span>
                      )}
                      <span className="text-[10px] bg-neutral-100 px-1 py-0.5 rounded text-neutral-500 leading-none">
                        {item.unit}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-400 leading-none pt-0.5">
                      {new Date(item.time).toLocaleDateString('zh-TW')}
                    </span>
                  </div>
                  
                  <CardTitle className="text-[0.8125rem] font-medium leading-tight text-neutral-800 py-0.5">
                    {item.title}
                  </CardTitle>
                  
                  {item.attach_file_link && item.attach_file_link.length > 0 && (
                     <div className="flex items-center text-[10px] text-neutral-400 mt-0.5 leading-none">
                       <Paperclip className="w-3 h-3 mr-1" /> 含附件 ({item.attach_file_link.length})
                     </div>
                  )}
                </CardHeader>
              </Card>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 pb-2 px-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full text-neutral-600 border-neutral-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> 上一頁
                </Button>
                <span 
                  className="text-[14px] text-neutral-500 font-medium"
                  style={{ WebkitTextSizeAdjust: "none", textSizeAdjust: "none" }}
                >
                  {currentPage} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full text-neutral-600 border-neutral-200"
                >
                  下一頁 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- POP-UP MODAL --- */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/30 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={() => setSelectedAnnouncement(null)} />
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
              <div className="flex-1 overflow-y-auto pr-2 mb-4 scrollbar-hide space-y-6">
                <p className="text-sm md:text-base text-neutral-600 whitespace-pre-wrap leading-relaxed">
                  {selectedAnnouncement.content || "此公告無詳細內容。"}
                </p>

                {selectedAnnouncement.imgs_links && selectedAnnouncement.imgs_links.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {selectedAnnouncement.imgs_links.map((imgUrl, idx) => (
                      <img 
                        key={idx} 
                        src={imgUrl} 
                        alt={`公告圖片 ${idx + 1}`} 
                        className="w-full rounded-xl border border-neutral-100 object-contain max-h-[60vh] bg-neutral-50"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Action Buttons for Attachments */}
              {selectedAnnouncement.attach_file_link && selectedAnnouncement.attach_file_link.length > 0 && (
                <div className="pt-4 border-t border-neutral-100 mt-auto flex flex-col gap-2">
                  <span className="text-xs text-neutral-500 font-medium mb-1">附件下載</span>
                  {selectedAnnouncement.attach_file_link.map((file, idx) => (
                    <Button key={idx} variant="outline" className="w-full justify-between rounded-xl h-auto py-3 px-4 border-neutral-200 hover:bg-neutral-50" asChild>
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center truncate mr-2">
                          <Paperclip className="w-4 h-4 mr-2 shrink-0 text-neutral-400" />
                          <span className="truncate text-sm text-neutral-700">{file.name}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 shrink-0 text-neutral-400" />
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}