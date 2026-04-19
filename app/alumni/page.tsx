"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const alumniData = [
  { 
    id: 1, 
    name: "19屆 羅靜靜 (Roger)", 
    title: "知名Minecraft Noob", 
    imageUrl: "/roger.jpg" 
  },
  { 
    id: 2, 
    name: "19屆 金呆呆 (Kim Noob)", 
    title: "知名禿頭老", 
    imageUrl: "/albert.jpg" 
  },
];

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
          <h1 className="text-2xl font-medium tracking-wide">傑出校友</h1>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full space-y-6 text-neutral-700">
          <section>
            <p className="leading-relaxed mb-8 text-neutral-600">
              歡迎來到傑出校友專區。在這裡，我們展示了在各行各業中表現優異，並為社會帶來正面影響力的校友們。
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pt-4">
              {alumniData.map((alumnus) => (
                <motion.div 
                  key={alumnus.id} 
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative w-40 h-40 md:w-48 md:h-48 mb-4 overflow-hidden rounded-full shadow-md border-4 border-white">
                    <Image
                      src={alumnus.imageUrl}
                      alt={alumnus.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 160px, 192px"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-800 tracking-wide mb-1">
                    {alumnus.name}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {alumnus.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Add more sections as needed */}
        </main>
      </motion.div>
    </div>
  );
}