"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Search, FileText, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


//
// TODO: Download the entire website in json, and search that json
//


function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Grab the "q" parameter from the URL (e.g., /search?q=公告)
  const query = searchParams.get("q") || "";

  // ---------------------------------------------------------
  // THE GLOBAL SITE INDEX (Mock Database)
  // In a real app, you would fetch this from your API/CMS.
  // It contains content from your main page AND sub-pages.
  // ---------------------------------------------------------
  const siteData = [
    // Sub-page: Intro / About
    { id: "intro-1", title: "認識政附：學校歷史與願景", content: "國立政治大學附屬高級中學成立於...", category: "關於我們", href: "/intro", type: "page" },
    { id: "intro-2", title: "校長室", content: "校長的話與治校理念...", category: "關於我們", href: "/intro#principal", type: "page" },
    
    // Main Page Sections: Zones
    { id: "zone-1", title: "學生請假系統", content: "線上辦理學生事假、病假、公假...", category: "常用專區", href: "/#zones", type: "section" },
    { id: "zone-2", title: "成績查詢系統", content: "查詢各次段考成績與學期總成績...", category: "常用專區", href: "/#zones", type: "section" },
    { id: "zone-3", title: "場地借用系統", content: "借用會議室、體育館、演藝廳等校內空間...", category: "常用專區", href: "/#zones", type: "section" },

    // Main Page Sections: Announcements (Different Categories)
    { id: "ann-1", title: "113學年度新生入學注意事項", content: "教務處提醒新生於開學前完成線上報到手續...", category: "教務處", href: "/#announcements", type: "announcement" },
    { id: "ann-2", title: "高一選課說明會時間異動", content: "原訂於下週三的選課說明會，因故順延至週五下午...", category: "高一", href: "/#announcements", type: "announcement" },
    { id: "ann-3", title: "113學年度大學繁星推薦校內報名", content: "請有意願參與繁星推薦的同學（高三），備妥相關文件至註冊組...", category: "高三", href: "/#announcements", type: "announcement" },
    { id: "ann-4", title: "政大附中社團成果發表會", content: "學務處邀請大家共襄盛舉，欣賞各社團一年來的努力成果...", category: "全部公告", href: "/#announcements", type: "announcement" },
    { id: "ann-5", title: "國中部八年級隔宿露營活動須知", content: "國二學生請注意，本週五將發放隔宿露營家長同意書...", category: "國二", href: "/#announcements", type: "announcement" },
  ];

  // Filter the data based on the user's query
  const results = query 
    ? siteData.filter(
        (item) => 
          item.title.toLowerCase().includes(query.toLowerCase()) || 
          item.content.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-neutral-50 relative">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full flex items-center gap-4 p-5 md:px-10 bg-white/80 backdrop-blur-md border-b border-neutral-100 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0 text-neutral-900">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-xs tracking-widest text-neutral-500 mb-1">全站搜尋結果</span>
          <h1 className="text-lg font-medium tracking-wide truncate">
            {query ? `"${query}"` : "請輸入關鍵字"}
          </h1>
        </div>
      </header>

      {/* Main Results Area */}
      <main className="flex-1 p-4 md:px-8 py-8 w-full max-w-4xl mx-auto">
        {!query ? (
          // Empty State: No query provided
          <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
            <Search className="w-12 h-12 mb-4 opacity-30" />
            <p>請在上方或選單中輸入關鍵字進行全站搜尋</p>
          </div>
        ) : results.length > 0 ? (
          // Success State: Results found
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-4"
          >
            <p className="text-sm text-neutral-500 mb-6 px-1">
              找到 <span className="font-semibold text-neutral-900">{results.length}</span> 筆與「{query}」相關的結果：
            </p>
            {results.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
              >
                {/* Wrap the result card in a Next.js Link so it navigates correctly */}
                <Link href={item.href} className="block p-5 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-neutral-100 rounded-xl shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      {item.type === 'page' || item.type === 'section' ? (
                        <LinkIcon className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md">
                          {item.category}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {item.type === 'page' ? '網站頁面' : item.type === 'section' ? '首頁專區' : '公告'}
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-neutral-900 mb-1 group-hover:underline decoration-neutral-300 underline-offset-4">
                        {item.title}
                      </h2>
                      <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty State: No matches found
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-neutral-400"
          >
            <Search className="w-12 h-12 mb-4 opacity-30" />
            <p>找不到與「<span className="text-neutral-900">{query}</span>」相關的結果</p>
            <Button 
              variant="outline" 
              className="mt-6 rounded-full text-neutral-600"
              onClick={() => router.back()}
            >
              返回上一頁
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center text-neutral-400">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4" />
        <p className="text-sm">搜尋中...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}