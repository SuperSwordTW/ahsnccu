// src/components/BentoGrid.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Define the shape of our data
type Announcement = {
  id: string;
  title: string;
  date: string;
  link: string;
};

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
};

export default function BentoGrid({ announcements }: { announcements: Announcement[] }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-8 auto-rows-[250px]"
    >
      {announcements.map((item, index) => {
        // Make the first item take up more space to create the "Bento" effect
        const isFeatured = index === 0; 
        
        return (
          <motion.div 
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 0.98 }}
            className={`w-full h-full ${isFeatured ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}`}
          >
            <Card className="h-full flex flex-col justify-between overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardDescription className="text-xs font-medium text-muted-foreground">
                  {new Date(item.date).toLocaleDateString()}
                </CardDescription>
                <CardTitle className={`${isFeatured ? 'text-3xl' : 'text-lg'} leading-tight mt-2`}>
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-end pb-6">
                <Button variant={isFeatured ? "default" : "secondary"} size="sm">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Read More <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}