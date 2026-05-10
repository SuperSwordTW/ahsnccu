"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FeedbackPage() {
  const [identity, setIdentity] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // --- CONFIGURATION ---
  // Replace these with your actual Google Form details (see instructions below)
  const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScos-BJ4SrgykJg_t0LUcNPLvm-TGIu9KPzVVlauC7wm-Ec2g/formResponse";
  const ENTRY_ID_IDENTITY = "entry.191772546"; 
  const ENTRY_ID_CATEGORY = "entry.2010034903"; 
  const ENTRY_ID_DETAILS = "entry.219789526";  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the user has selected options from the buttons
    if (!identity || !category) {
      alert("請在提交前選擇您的身分和反饋類別。");
      return;
    }

    if (formRef.current) {
      // This submits the hidden form to Google's servers
      // The user will be redirected to the Google Form confirmation screen
      formRef.current.submit(); 
    }
  };

  return (
    <div className="flex flex-col w-full bg-neutral-100 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full bg-white rounded-b-[40px] shadow-sm flex flex-col p-6 md:p-12 min-h-screen"
      >
        <header className="flex items-center mb-10">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-medium tracking-wide">意見回饋 (Feedback)</h1>
        </header>

        <main className="flex-1 max-w-2xl mx-auto w-full space-y-6 text-neutral-700">

          {/* Visible Form UI */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-900">您的身分</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "學生", value: "學生" },
                  { label: "老師", value: "老師" },
                  { label: "家長", value: "家長" },
                  { label: "其他", value: "其他" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setIdentity(item.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      identity === item.value 
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm" 
                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-900">反饋類別</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "功能建議", value: "功能建議" },
                  { label: "使用體驗", value: "使用體驗" },
                  { label: "錯誤回報", value: "錯誤回報" },
                  { label: "其他", value: "其他" }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCategory(item.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      category === item.value 
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm" 
                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-900">
                {category === "使用體驗" ? "瀏覽網頁順暢嗎? 你認為哪裡設計上需要修正?" :
                 category === "功能建議" ? "你認為此網站還需要什麼功能會更方便?" :
                 category === "錯誤回報" ? "發生了怎麼樣的錯誤? 請詳細說明錯誤如何產生。" :
                 category === "其他" ? "請詳細說明您的意見。" :
                 "意見內容"}
              </label>
              <textarea 
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={6}
                placeholder={
                  category === "" 
                    ? "請先選擇一個類別..." 
                    : "請詳細描述您的意見..."
                }
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white text-sm focus:border-neutral-400 focus:ring-0 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <Button type="submit" className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl py-6 text-base">
              送出
            </Button>
          </form>

          {/* Hidden Form for Actual Google Form Payload */}
          <form 
            ref={formRef} 
            action={GOOGLE_FORM_ACTION_URL} 
            method="POST" 
            className="hidden"
          >
            <input type="hidden" name={ENTRY_ID_IDENTITY} value={identity} />
            <input type="hidden" name={ENTRY_ID_CATEGORY} value={category} />
            <input type="hidden" name={ENTRY_ID_DETAILS} value={details} />
          </form>
        </main>
      </motion.div>
    </div>
  );
}