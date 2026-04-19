"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function IntroPage() {
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
          <h1 className="text-2xl font-medium tracking-wide">認識政附</h1>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full space-y-6 text-neutral-700">
          <section>
            <h2 className="text-xl font-bold text-neutral-900 mb-3">學校簡介</h2>
            <p className="leading-relaxed">

            </p>
          </section>
          
          {/* Add more sections as needed */}
        </main>
      </motion.div>
    </div>
  );
}