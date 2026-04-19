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
國立政治大學附屬高級中學是由敎育部、教育局和政治大學共同設立的高中，自1998年開始規劃，於2005年順利完工，首開政府與大學合作創校之先河。
<br/><br/>
政附校園建於指南山隱然而高之地，巧用地形、善謀地利，化坡地為可觀、耐震之教學空間。
<br/><br/>
佇立於山坡上的政附，遠望青翠蒼鬱環繞四周，俯瞰指南山麓錯落樓宇；依稀可見，藏於山林間的動物園；置身其間，始見政附校園之青春瑰麗。無圍牆的校園落實了自由無邊的精神；參差的樓層與天橋在斜陽的照射下顯得錯落有序；校舍之上有圖書悠閱閣，挑高採光，藏書萬千，是政附源源不絕的知識藏庫，感謝湯教授志民每年不間斷捐贈萬元以上的新書。
<br/><br/>
FACE (Freedom, Autonomy, Creativity, Energy) 象徵了政附的精神。縱使遠居在台北之南，日夜服車馬之勞，但學生未有不樂。自由自律，放意肆志，絕勝癡於讀書之人。
<br/><br/>
政附持續以多元的課程打造創意與活力，不斷學習，力求精進，譜寫著與日爭輝的歷史。政附學子，如同校徽上威儀非凡的大冠鷲模樣，堅守著正直與自信昂揚，乘風御氣，持萬卷詩書與自在心志，翱翔天際。
            </p>
          </section>
          
          {/* Add more sections as needed */}
        </main>
      </motion.div>
    </div>
  );
}