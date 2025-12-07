import { z } from "zod";
import { searchKnowledgeBase } from "../db/embeddings.js";
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
};
const inputSchema = z.object({
    query: z.string(),
    category: z
        .enum(["paradigm", "tradition", "method", "quality", "concept", "journal", "all"])
        .optional()
        .default("all"),
    n_results: z.number().optional().default(5),
});
// Map input category to collection category
const categoryMap = {
    paradigm: "paradigms",
    tradition: "traditions",
    method: "methods",
    quality: "methods", // quality is part of methods
    concept: "exemplars",
    journal: "journals",
    all: "all",
};
export async function searchKnowledge(args) {
    // Defensive coding
    if (!args || typeof args !== 'object' || !args.query || typeof args.query !== 'string' || args.query.trim() === '') {
        return {
            error: true,
            message: "search_knowledge 도구에 필수 인자 'query'가 전달되지 않았습니다.",
            required_parameters: { query: "(필수) 검색 질의" },
            example: { query: "질적연구 신빙성 확보 방법", category: "quality" },
            hint: "검색하고 싶은 내용을 query 파라미터에 전달해주세요."
        };
    }
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
//# sourceMappingURL=searchKnowledge.js.map