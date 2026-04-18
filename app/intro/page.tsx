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
國立政治大學附屬高級中學由敎育部、臺北市政府(教育局)和國立政治大學共同籌劃設立，自1998年開始規劃，於2005年順利完工，開政府與大學合作創校之先河。
<br />
<br />
2005年8月1日首任校長湯志民教授就職，第一屆招生高中6班、國中5班。創校之初，推展自由學風與創新課程，學生不僅沒有制服約束，還擁有許多活動歷練與機會展現自我；課程強調專業與獨立性，提供豐富時間和場域讓師生討論探究；開發獨立學習課程，培養學生探索興趣與自學能力，為多元自主學習先驅；結合大學資源，設立預修大學AP課程計畫。首度招生即受到各界高度關注與一致肯定，躋身頂尖高中之列。 
<br />
<br />
2009年第二任校長由原新竹實中吳榕峯校長接任，任內將學務處搬遷至丁棟教學區，使學生事務能更即時執行。2010年高中部設立數理資優班，強調數理人才培養，並率師生團隊至德國、美國、新加坡等地進行深度交流參訪，開拓國際視野。 
<br />
<br />
2012年9月3日吳校長轉任臺中市政府教育局長，由政大教育系郭昭佑教授兼任代理校長。郭校長積極推展英語教育，開設多益課程，英語活動競賽表現傑出亮眼。2015年首次辦理基北區特色招生考試分發入學，本校並於同年成立英語國際特色班。 
<br />
<br />
2015年郭昭佑校長轉任政大教育系系主任，由原暨大附中校長陳啓東接任第四任校長。陳校長積極引進外籍教師，讓學生以浸潤式方式學習英文。為提升教育品質，參與教育部高中優質化輔助方案，建立教師社群，推動教師專業精進，發展各式多元課程，亦提升各項教學設備。 
<br />
<br />
2019年陳啓東校長歸建國立暨南大學教授，由原北一女中學務主任張麗萍接任第五任校長。張校長帶領教師團隊落實雙語教育；在108課綱的多元架構下，提升課程的精緻度與寬廣度，並強調社會關懷與人文精神。引進政大商學院資源辦理北成政小大學課程；學生參與政大USR計畫，發現社區問題並提出解決方案；發展SDGs(聯合國永續發展目標)課程，期許學生能結合環境，全人發展。 
<br />
<br />
政附校園依傍山坡興建，經巧用地形、善謀地利的創意設計，創造出安全耐震、極具層次感的人性化互動空間，是指南山麓富含人文藝術的景觀建築。 
<br />
<br />
政附處處蘊含潛移默化的境教，無圍牆的校園體現了自由自律的無邊精神。每棟建築物以天花板和電梯的顏色呼應錯落的樓層，展現創意巧思。九九長廊從學校連結至社區，不僅是每一位政附學子畢業前緬懷校園並展望未來的巡禮路程，更象徵了學校師長期許政附學子將所思、所學結合地方精神，將來貢獻社會、放眼世界。藏書四萬多本的圖書館悠閱閣擁有挑高空間、大面積明亮採光，是壯麗開闊的圓弧樓中樓。湯教授志民自創校至今每年不間斷捐贈萬元以上的新書，造就政附源源不絕的知識寶藏庫。 
<br />
<br />
聳立在旗艦廣場的裝置藝術FACE，是政附的精神象徵 。代表政大附中培養學生具有自由(Freedom)、自律(Autonomy)、創意(Creativity)、活力(Energy)的核心價值。 
<br />
<br />
政附用開闊的思維、活潑的教學引領孩子打破框架、自由思考；用陪伴、理解和溝通啟發孩子培養自律與責任心。以多元的課程、豐富的活動激發孩子的創意；我們不斷學習、求新求好，展現持續精進的活力。 
<br />
<br />
政附持續以自由、自律、創意、活力譜寫著輝煌歷史，如同第一屆學生彭子桓所設計的校徽大冠鷲，威風凜凜側立著的大冠鷲，代表政大附中學子的帥氣、正直與自信昂揚模樣；大冠鷲的翅膀由線條呈現，象徵學子在學習與處世間循序沉穩、有條不紊。當大冠鷲御風而上、展開V字的雙翅翱翔之際，政附學子亦帶著勝利的V、微笑的V，鷹揚天下、遨遊寰宇！
            </p>
          </section>
          
          {/* Add more sections as needed */}
        </main>
      </motion.div>
    </div>
  );
}