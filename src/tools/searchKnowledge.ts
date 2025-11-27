import { z } from "zod";
import { searchKnowledgeBase } from "../db/embeddings.js";
import { CollectionCategory } from "../db/collections.js";

export const searchKnowledgeSchema = {
  type: "object",
  properties: {
    query: {
      type: "string",
      description: "검색 질의",
    },
    category: {
      type: "string",
      enum: ["paradigm", "tradition", "method", "quality", "concept", "journal", "all"],
      description: "검색 카테고리",
    },
    n_results: {
      type: "number",
      description: "반환 결과 수 (기본값: 5)",
    },
  },
  required: ["query"],
} as const;

const inputSchema = z.object({
  query: z.string(),
  category: z
    .enum(["paradigm", "tradition", "method", "quality", "concept", "journal", "all"])
    .optional()
    .default("all"),
  n_results: z.number().optional().default(5),
});

// Map input category to collection category
const categoryMap: Record<string, CollectionCategory | "all"> = {
  paradigm: "paradigms",
  tradition: "traditions",
  method: "methods",
  quality: "methods", // quality is part of methods
  concept: "exemplars",
  journal: "journals",
  all: "all",
};

export async function searchKnowledge(args: Record<string, unknown>) {
  const { query, category, n_results } = inputSchema.parse(args);

  const collectionCategory = categoryMap[category] || "all";
  const results = await searchKnowledgeBase(query, collectionCategory, n_results);

  if (results.length === 0) {
    return {
      message: "검색 결과가 없습니다.",
      query,
      category,
      suggestions: [
        "다른 검색어로 시도해보세요",
        "카테고리를 'all'로 변경해보세요",
        "더 일반적인 용어를 사용해보세요",
      ],
    };
  }

  return {
    query,
    category,
    total_results: results.length,
    results: results.map((r, i) => ({
      rank: i + 1,
      content: r.content,
      source: r.metadata.source || "unknown",
      relevance_score: r.distance ? (1 - r.distance).toFixed(3) : "N/A",
    })),
  };
}
