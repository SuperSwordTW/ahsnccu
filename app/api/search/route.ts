import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

// Initialize Supabase with Service Role to bypass RLS (if needed for the RPC)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or ANON KEY if RLS permits
);

// Initialize Google AI Studio GenAI SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { query, category } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Generate the embedding for the search query
    const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
    const result = await model.embedContent({
      content: { role: "user", parts: [{ text: query }] },
      taskType: TaskType.RETRIEVAL_QUERY,
      outputDimensionality: 768,
    } as any);
    const queryEmbedding = result.embedding.values;

    // 2. Call the Supabase RPC to find nearest neighbors
    const { data, error } = await supabase.rpc("match_announcements", {
      query_embedding: queryEmbedding,
      match_threshold: 0.65, // Adjust this threshold based on accuracy needs
      match_count: 12,      // Retrieve enough for 2 pages of 6 items
    });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}