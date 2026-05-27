"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, ExternalLink, Loader2, Plus, LayoutGrid, ArrowUp, ArrowDown, Trash2, Image as ImageIcon, Type, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the Block structure
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
  image_url: string; // Used as the cover image for the grid
  source_url: string;
  content_blocks: ContentBlock[];
  created_at: string;
};

export default function ProjectsPage() {
  const [mode, setMode] = useState<"gallery" | "submit">("gallery");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: crypto.randomUUID(), type: "text", value: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setIsUploadingCover(true);
      const url = await uploadImage(e.target.files[0]);
      setCoverImage(url);
    } catch (error) {
      alert("圖片上傳失敗，請檢查檔案大小或網路連線。");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleBlockImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploadingBlockId(id);
      const url = await uploadImage(e.target.files[0]);
      updateBlock(id, url);
    } catch (error) {
      alert("圖片上傳失敗，請檢查檔案大小或網路連線。");
    } finally {
      setUploadingBlockId(null);
    }
  };

  useEffect(() => {
    if (mode === "gallery") fetchProjects();
  }, [mode]);

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("student_projects")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error && data) setProjects(data);
    setIsLoading(false);
  };

  // --- Block Builder Logic ---
  const addBlock = (type: "text" | "image") => {
    setBlocks([...blocks, { id: crypto.randomUUID(), type, value: "" }]);
  };

  const updateBlock = (id: string, value: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, value } : b));
  };

  const removeBlock = (id: string) => {
    if (blocks.length > 1) {
      setBlocks(blocks.filter(b => b.id !== id));
    }
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= blocks.length) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    setBlocks(newBlocks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Filter out completely empty blocks before submitting
    const cleanedBlocks = blocks.filter(b => b.value.trim() !== "");

    const { error } = await supabase
      .from("student_projects")
      .insert([{ 
          title, 
          author, 
          summary, 
          image_url: coverImage, 
          source_url: sourceUrl,
          content_blocks: cleanedBlocks,
          status: "pending" 
      }]);

    setIsSubmitting(false);
    if (error) {
      alert("提交失敗，請重試。(Submission failed)");
    } else {
      alert("作品已成功提交，正在等待管理員審核！");
      setMode("gallery");
      // Reset form
      setTitle(""); setAuthor(""); setSummary(""); setCoverImage(""); setSourceUrl("");
      setBlocks([{ id: crypto.randomUUID(), type: "text", value: "" }]);
    }
  };

  return (
    <div className="flex flex-col w-full bg-neutral-100 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full bg-white rounded-b-[40px] shadow-sm flex flex-col p-6 md:p-12 min-h-screen"
      >
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-4">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-medium tracking-wide">學生作品</h1>
          </div>
          <Button 
            variant={mode === "gallery" ? "outline" : "default"} 
            onClick={() => setMode(mode === "gallery" ? "submit" : "gallery")}
            className="rounded-xl"
          >
            {mode === "gallery" ? <><Plus className="w-4 h-4 mr-2" /> 提交作品</> : <><LayoutGrid className="w-4 h-4 mr-2" /> 返回展廳</>}
          </Button>
        </header>

        <main className="flex-1 w-full mx-auto">
          <AnimatePresence mode="wait">
            {mode === "gallery" ? (
              <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-6xl mx-auto">
                {isLoading ? (
                  <div className="flex justify-center py-20 text-neutral-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-20 text-neutral-400 border border-dashed rounded-2xl">
                    目前沒有已核准的作品。
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((item) => (
                        <motion.div 
                          key={item.id}
                          whileHover={{ y: -4 }} // Smooth floating effect instead of shrinking
                          className="w-full h-full"
                        >
                          <Link href={`/projects/${item.id}`} className="block w-full h-full cursor-pointer outline-none">
                            {/* Upgraded to rounded-3xl and enhanced the shadow on hover for a premium feel */}
                            <Card className="h-full flex flex-col overflow-hidden border-neutral-200/80 bg-white hover:border-neutral-300 transition-all duration-300 group shadow-sm hover:shadow-xl">
                              
                              {/* Image Section: aspect-[4/3] makes the box larger. bg-neutral-50 creates a soft studio backdrop */}
                              <div className="w-full aspect-[4/3] bg-neutral-50 relative flex items-center justify-center p-6 overflow-hidden border-b border-neutral-100">
                                {item.image_url && (
                                  <img 
                                    src={item.image_url} 
                                    alt={item.title} 
                                    /* object-contain ensures zero cut-off. drop-shadow makes the image pop off the background */
                                    className="w-full h-full object-contain drop-shadow-sm transition-transform duration-700 group-hover:scale-105" 
                                  />
                                )}
                              </div>
                              
                              {/* Text Section: flex-1 ensures buttons/text align properly if titles are different lengths */}
                              <div className="flex flex-col flex-1 p-6 md:p-8 bg-white z-10">
                                <CardDescription className="text-xs font-semibold tracking-wider text-neutral-400 mb-2 uppercase">
                                  {item.author} • {new Date(item.created_at).toLocaleDateString()}
                                </CardDescription>
                                <CardTitle className="text-xl md:text-2xl font-bold leading-snug mb-3 text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-2">
                                  {item.title}
                                </CardTitle>
                                <p className="text-sm md:text-base text-neutral-500 line-clamp-2 leading-relaxed">
                                  {item.summary}
                                </p>
                              </div>
                            </Card>
                          </Link>
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>
            ) : (
              // --- SUBMISSION FORM ---
              <motion.div key="submit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-3xl mx-auto pb-20">
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Info Section */}
                  <div className="bg-neutral-50/50 p-6 rounded-3xl border border-neutral-100 space-y-5">
                    <h2 className="text-lg font-medium text-neutral-800 border-b border-neutral-200 pb-2">基本資訊 (顯示於首頁網格)</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-900">專案名稱</label>
                        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 rounded-xl border border-neutral-200 focus:border-neutral-400 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-900">作者 / 團隊</label>
                        <input required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full p-3 rounded-xl border border-neutral-200 focus:border-neutral-400 outline-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-900">封面圖片 (Cover Image)</label>
                      <div className="flex flex-col gap-3">
                        {coverImage && (
                          <img src={coverImage} alt="Cover Preview" className="w-full max-w-xs rounded-xl border border-neutral-200 object-cover aspect-video" />
                        )}
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="outline" className="relative overflow-hidden rounded-xl">
                            {isUploadingCover ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                            {isUploadingCover ? "上傳中..." : "選擇圖片"}
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleCoverUpload}
                              disabled={isUploadingCover}
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                          </Button>
                          <span className="text-xs text-neutral-400">或直接貼上網址</span>
                        </div>
                        <input required value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="圖片網址 (https://...)" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-neutral-400 outline-none text-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-900">簡短摘要 (Summary)</label>
                      <textarea required value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="w-full p-3 rounded-xl border border-neutral-200 focus:border-neutral-400 outline-none resize-none" placeholder="一兩句話介紹這個作品..." />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-900">外部專案連結 (選填)</label>
                      <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="GitHub, YouTube, 網站連結..." className="w-full p-3 rounded-xl border border-neutral-200 focus:border-neutral-400 outline-none" />
                    </div>
                  </div>

                  {/* Block Builder Section */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-neutral-800 mb-4">詳細內容 (自訂排版)</h2>
                    
                    {blocks.map((block, index) => (
                      <div key={block.id} className="group relative flex gap-3 p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:border-neutral-300 transition-all">
                        
                        {/* Drag / Reorder Controls */}
                        <div className="flex flex-col gap-1 text-neutral-400">
                          <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="p-1 hover:bg-neutral-100 rounded disabled:opacity-30">
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="p-1 hover:bg-neutral-100 rounded disabled:opacity-30">
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Input Area */}
                        <div className="flex-1">
                          {block.type === "text" ? (
                            <textarea 
                              value={block.value} 
                              onChange={(e) => updateBlock(block.id, e.target.value)} 
                              placeholder="輸入文字內容..." 
                              rows={4} 
                              className="w-full p-2 bg-transparent outline-none resize-y text-neutral-700" 
                            />
                          ) : (
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
                                <ImageIcon className="w-4 h-4" /> 圖片區塊
                              </div>
                              {block.value && (
                                <img src={block.value} alt="Block Preview" className="w-full max-w-md rounded-xl border border-neutral-200 object-cover" />
                              )}
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <Button type="button" variant="outline" size="sm" className="relative overflow-hidden shrink-0">
                                  {uploadingBlockId === block.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                                  {uploadingBlockId === block.id ? "上傳中..." : "上傳圖片"}
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleBlockImageUpload(block.id, e)}
                                    disabled={uploadingBlockId === block.id}
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                  />
                                </Button>
                                <input 
                                  value={block.value} 
                                  onChange={(e) => updateBlock(block.id, e.target.value)} 
                                  placeholder="或輸入圖片網址 (https://...)" 
                                  className="w-full p-2 bg-neutral-50 rounded-lg border border-neutral-200 outline-none text-sm" 
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Delete Action */}
                        <button type="button" onClick={() => removeBlock(block.id)} disabled={blocks.length === 1} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors self-start disabled:opacity-30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Add Block Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => addBlock("text")} className="rounded-xl border-dashed">
                        <Type className="w-4 h-4 mr-2" /> 新增文字
                      </Button>
                      <Button type="button" variant="outline" onClick={() => addBlock("image")} className="rounded-xl border-dashed">
                        <ImageIcon className="w-4 h-4 mr-2" /> 新增圖片
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl py-6 text-lg">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "送出審核"}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}