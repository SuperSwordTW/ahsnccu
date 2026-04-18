import { motion, Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const zones = [
  { 
    name: "政附導航系統", 
    url: "https://map-rho-blue.vercel.app/", 
    icon: "/AAA_icon.png",
    highlight: true
  },
  { name: "高中校務系統", url: "https://sschool.tp.edu.tw/Login.action?schNo=380301" },
  { name: "國中校務系統", url: "https://school.tp.edu.tw/Login.action?schNo=380301" },
  { name: "學習歷程", url: "https://e-portfolio.cooc.tp.edu.tw/Portal.do" },
  { name: "自主學習", url: "https://sschool.tp.edu.tw/Login.action?schNo=380301&type=learning" },
  { name: "公文系統", url: "https://ahs.speedodm.com/SPEED30/Account/Login" }
];

// Define variants if you want them to be specific to this component
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function ZonesSection() {
  return (
    <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-3 space-y-4">
      <div className="flex items-center justify-between px-1 mt-4 md:mt-0">
        <h2 className="text-lg font-medium flex items-center gap-2 text-neutral-800">
          <span className="w-2 h-2 rounded-none bg-neutral-400 transform rotate-45" /> 常用專區
        </h2>
      </div>
      
      <Card className="border-neutral-200 rounded-2xl shadow-none overflow-hidden">
        <div className="flex flex-col divide-y divide-neutral-100">
          {/* Using .map on all or sliced zones depending on your UI preference */}
          {zones.slice(0, 5).map((zone, idx) => (
            <a 
                key={idx} 
                href={zone.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-4 text-sm text-left transition-all duration-300 
                    ${zone.highlight 
                    ? 'bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-50 text-blue-700' 
                    : 'hover:bg-neutral-50 text-neutral-700'}`}
            >
                <div className="flex items-center gap-3">
                    {zone.icon && (
                        <img 
                            src={zone.icon} 
                            alt="" 
                            className={`w-5 h-5 object-contain ${zone.highlight ? 'drop-shadow-sm' : ''}`} 
                        />
                    )}
                    <span className={zone.highlight ? 'font-medium' : ''}>{zone.name}</span>
                    
                </div>
                <ChevronRight className={`w-4 h-4 ${zone.highlight ? 'text-blue-300' : 'text-neutral-300'}`} />
            </a>
            ))}
        </div>
      </Card>
    </motion.div>
  );
}