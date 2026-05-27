"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink, Loader2, Calendar, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ContentBlock = {
  id: string;
  type: "text" | "image";
  value: string;
};

type Project = {
  id: string;
  title: string;
  author: string;
  summary: string;
  image_url: string;
  source_url: string;
  content_blocks: ContentBlock[];
  created_at: string;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      const { data, error } = await supabase
        .from("student_projects")
        .select("*")
        .eq("id", projectId)
        .eq("status", "approved") // Extra safety check
        .single();

      if (!error && data) {
        setProject(data);
      }
      setIsLoading(false);
    };

    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 text-neutral-500">
        <p className="text-lg">找不到該作品或仍在審核中。</p>
        <Link href="/projects">
          <Button variant="outline" className="mt-4 rounded-xl">返回展廳</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-neutral-100 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full bg-white rounded-b-[40px] shadow-sm flex flex-col min-h-screen pb-20"
      >
        {/* Navigation Header */}
        <header className="sticky top-0 z-30 w-full flex items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-neutral-100">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="rounded-xl text-neutral-600 hover:text-neutral-900">
              <ChevronLeft className="w-4 h-4 mr-1" /> 返回作品列表
            </Button>
          </Link>
        </header>

        <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-8 md:pt-12">
          
          {/* Hero Section */}
          <div className="space-y-6 mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="font-medium text-neutral-700">{project.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.created_at).toLocaleDateString('zh-TW')}</span>
              </div>
            </div>

            {project.image_url && (
              <div className="w-full aspect-[16/9] overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-50 shadow-sm mt-8">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Content Area (Constrained width for readability) */}
          <div className="max-w-2xl mx-auto space-y-10">
            
            {/* Summary */}
            <div className="text-xl text-neutral-600 font-medium leading-relaxed border-l-4 border-neutral-200 pl-6">
              {project.summary}
            </div>

            {/* Dynamic Blocks */}
            <div className="space-y-8">
              {project.content_blocks && project.content_blocks.length > 0 ? (
                project.content_blocks.map((block, idx) => {
                  if (block.type === "text") {
                    return (
                      <p key={idx} className="text-lg text-neutral-800 whitespace-pre-wrap leading-relaxed tracking-wide">
                        {block.value}
                      </p>
                    );
                  }
                  if (block.type === "image") {
                    return (
                      <figure key={idx} className="my-10">
                        <img 
                          src={block.value} 
                          alt={`Project visual ${idx}`} 
                          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 shadow-sm" 
                        />
                      </figure>
                    );
                  }
                  return null;
                })
              ) : (
                <p className="text-neutral-400 italic text-center py-10">無詳細內容。</p>
              )}
            </div>

            {/* Call to Action */}
            {project.source_url && (
              <div className="pt-12 pb-8 border-t border-neutral-100 mt-12 flex flex-col items-center text-center">
                <h3 className="text-lg font-medium text-neutral-900 mb-2">想了解更多嗎？</h3>
                <p className="text-neutral-500 text-sm mb-6">點擊下方按鈕前往查看此專案的完整原始碼或外部頁面。</p>
                <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                  <Button className="w-full md:w-auto rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 px-8 py-6 text-base">
                    前往外部專案連結 <ExternalLink className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              </div>
            )}
          </div>

        </main>
      </motion.div>
    </div>
  );
}