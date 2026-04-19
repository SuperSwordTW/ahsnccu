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
佇立於山坡上的政附，遠而望之，是文山區錯落的樓房；自遠而至，是藏於山林間的動物園；迫而察之，始見政附校園之偉麗。無圍牆的校園落實了自由無邊的精神；參差的樓層與天橋在斜陽的照射下顯得錯落有序；校府之上有圖書悠閱閣，挑高採光，藏書萬千，是政附源源不絕的知識藏庫，感湯教授志民每年不間斷捐贈萬元以上的新書。
<br/><br/>
FACE (Freedom, Autonomy, Creativity, Energy) 象徵了政附的精神。縱使居遠在台北南末之地，日夜服車馬之勞，采椽之居，但學生未有不樂。自由自律，放意肆志，絕勝癡於讀書之人。
<br/><br/>
政附持續以豐富的課程打造闊綽的活力，不斷學習，力求精進，譜寫著與日爭輝的歷史。政附學子，如同校徽上威儀非凡的大冠鷲，堅守著正直與自信昂揚模樣，又乘風御氣，持百年詩書與自在心志遊乎山水之間、遨遊寰宇。
<br/><br/>
首任校長湯志民教授於2005年8月1日就職。創校之初，推展自由與創新風氣，學生沒有制服約束、擁有許多機會展現自我；課程強調專業與獨立性，提供豐富時間和場域讓師生討論探究，為自主學習之先驅；結合大學資源，設立預修大學AP課程計畫。首度招生即躋身頂尖高中之列。 
<br/><br/>
第二任校長由吳榕峯校長於2009年接任。高中部設立數理資優班，強調數理人才培養，並率師生團隊至德國、美國、新加坡等地進行深度交流參訪，開拓國際視野。 
<br/><br/>
2012年9月3日政大郭昭佑教授兼任代理校長。郭校長推展英語教育，開設多益課程，英語活動競賽。2015年辦理基北區特色招生考試分發入學，於同年成立英語特色班。
<br/><br/>
2015年由陳啓東校長接任第四任校長。陳校長引外籍教師，提升英文教育品質。參與教育部高中優質化輔助方案，建立教師社群，推動教師專業精進，發展各式多元課程。 
<br/><br/>
2019年由張麗萍接任第五任校長。張校長帶領教師落實雙語教育，在108課綱的架構下，精緻化課程；引進政大商學院資源辦理北成政小大學課程；學生參與政大USR計畫，解決社區問題。 
<br/><br/>
2025年由林千惠校長接任第六位校長。
            </p>
          </section>
          
          {/* Add more sections as needed */}
        </main>
      </motion.div>
    </div>
  );
}