"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight } from "lucide-react";
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
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}