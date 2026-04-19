"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NavigationMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const menuItems = [
  { label: "最新公告", href: "#announcements" },
  { label: "常用專區", href: "#zones" },
  { label: "行事曆", href: "#calendar" },
  { label: "認識政附", href: "/intro" }
];

export default function NavigationMenu({
  isOpen,
  setIsOpen,
  searchQuery,
  setSearchQuery
}: Omit<NavigationMenuProps, 'onSearch'>) {

  const router = useRouter();
  const [fontSizeLevel, setFontSizeLevel] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      // If the click is inside the menu, do nothing
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      
      // Ignore clicks on the header so the main menu toggle button doesn't conflict
      if ((e.target as Element).closest('header')) {
        return;
      }

      setIsOpen(false);
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, setIsOpen]);

  // Sync state with DOM when the menu opens
  useEffect(() => {
    const currentSize = document.documentElement.style.fontSize;
    if (currentSize === '120%') setFontSizeLevel(1);
    else if (currentSize === '140%') setFontSizeLevel(2);
    else setFontSizeLevel(0);
  }, [isOpen]);

  const cycleFontSize = () => {
    const nextLevel = (fontSizeLevel + 1) % 3;
    setFontSizeLevel(nextLevel);
    const sizeMap = ['110%', '120%', '140%'];
    document.documentElement.style.fontSize = sizeMap[nextLevel];
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Navigate to a search results page with the query as a URL parameter
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    
    // Close the menu and optionally clear the input after searching
    setIsOpen(false); 
    setSearchQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-[85px] right-4 z-40 w-[calc(100%-2rem)] md:w-80 bg-white border border-neutral-100 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Global Search Bar */}
          <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
            <form onSubmit={handleGlobalSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="搜尋全站..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              />
            </form>
          </div>

          {/* Adjustable Menu List */}
          <nav className="p-2">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-xl transition-colors"
              >
                {item.label}
                <ChevronRight className="w-4 h-4 text-neutral-300" />
              </a>
            ))}
            
            <div className="my-2 border-t border-neutral-100"></div>

            <button
              onClick={cycleFontSize}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Type className="w-4 h-4 text-neutral-500" />
                切換字體大小
              </div>
              <span className="text-xs text-neutral-400">
                {fontSizeLevel === 0 ? '標準' : fontSizeLevel === 1 ? '放大' : '特大'}
              </span>
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}