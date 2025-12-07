/**
 * Local File-based Search for Dr. QualMaster
 * ChromaDB 없이 작동하는 로컬 파일 기반 검색 시스템
 */

import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dist/db에서 실행되므로 ../../src/knowledge로 접근
const KNOWLEDGE_PATH = path.resolve(__dirname, "../../src/knowledge");

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory: string;
  filePath: string;
}

let knowledgeCache: KnowledgeDocument[] = [];
let isLoaded = false;

/**
 * 마크다운 파일에서 제목 추출
 */
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : "Untitled";
}

/**
 * 디렉토리 재귀 탐색으로 모든 마크다운 파일 찾기
 */
async function findMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function scan(currentDir: string) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.name.endsWith(".md")) {
          files.push(fullPath);
        }
      }
    } catch {
      // Directory might not exist
    }
  }

  await scan(dir);
  return files;
}

/**
 * 지식베이스 로드
 */
export async function loadKnowledgeBase(): Promise<void> {
  if (isLoaded) return;

  try {
    const files = await findMarkdownFiles(KNOWLEDGE_PATH);
    knowledgeCache = [];

    for (const filePath of files) {
      try {
        const content = await readFile(filePath, "utf-8");
        const relativePath = filePath.replace(KNOWLEDGE_PATH, "").replace(/\\/g, "/");
        const parts = relativePath.split("/").filter(Boolean);

        knowledgeCache.push({
          id: basename(filePath, ".md"),
          title: extractTitle(content),
          content,
          category: parts[0] || "general",
          subcategory: parts.length > 1 ? parts.slice(1, -1).join("/") : "",
          filePath,
        });
      } catch {
        // Skip files that can't be read
      }
    }

    isLoaded = true;
    console.error(`[LocalSearch] Loaded ${knowledgeCache.length} knowledge documents`);
  } catch (error) {
    console.error("[LocalSearch] Failed to load knowledge base:", error);
    knowledgeCache = [];
    isLoaded = true;
  }
}

/**
 * 검색 점수 계산 (키워드 매칭)
 */
function calculateScore(doc: KnowledgeDocument, queryTerms: string[]): number {
  const lowerContent = doc.content.toLowerCase();
  const lowerTitle = doc.title.toLowerCase();

  let score = 0;

  for (const term of queryTerms) {
    // term은 이미 toLowerCase() 되어 있음
    // 제목에서 발견시 높은 점수
    if (lowerTitle.includes(term)) {
      score += 10;
    }

    // 본문에서 발견시 - 정규식 특수문자 이스케이프
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = (lowerContent.match(new RegExp(escapedTerm, "gi")) || []).length;
    score += matches;
  }

  return score;
}

/**
 * 관련 컨텍스트 추출 (검색어 주변 텍스트)
 */
function extractContext(content: string, queryTerms: string[], maxLength: number = 500): string {
  const lowerContent = content.toLowerCase();

  for (const term of queryTerms) {
    const lowerTerm = term.toLowerCase();
    const index = lowerContent.indexOf(lowerTerm);

    if (index !== -1) {
      const start = Math.max(0, index - 100);
      const end = Math.min(content.length, index + maxLength);
      let context = content.slice(start, end);

      // 문장 경계에서 자르기
      if (start > 0) context = "..." + context;
      if (end < content.length) context = context + "...";

      return context.trim();
    }
  }

  // 검색어를 찾지 못하면 처음 부분 반환
  return content.slice(0, maxLength) + (content.length > maxLength ? "..." : "");
}

export interface LocalSearchResult {
  content: string;
  metadata: {
    source: string;
    title: string;
    category: string;
    subcategory: string;
  };
  score: number;
}

/**
 * 지식베이스 검색
 */
export async function searchLocal(
  query: string,
  category: string = "all",
  nResults: number = 5
): Promise<LocalSearchResult[]> {
  await loadKnowledgeBase();

  if (knowledgeCache.length === 0) {
    console.error("[LocalSearch] No documents in cache");
    return [];
  }

  // 검색어 토큰화 (한글, 영문 모두 지원)
  const queryTerms = query
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((term) => term.length >= 2);

  console.error(`[LocalSearch] Query: "${query}", Terms: ${JSON.stringify(queryTerms)}, Docs: ${knowledgeCache.length}`);

  // 카테고리 필터링
  let docsToSearch = knowledgeCache;
  if (category !== "all") {
    docsToSearch = knowledgeCache.filter((doc) =>
      doc.category === category ||
      doc.category === categoryMapping[category]
    );
  }

  // 점수 계산 및 정렬
  const allScored = docsToSearch.map((doc) => ({
    doc,
    score: calculateScore(doc, queryTerms),
  }));

  // 디버깅: 상위 3개 점수 출력
  const topScores = allScored.sort((a, b) => b.score - a.score).slice(0, 3);
  console.error(`[LocalSearch] Top scores: ${topScores.map(s => `${s.doc.id}:${s.score}`).join(", ")}`);

  const scoredDocs = allScored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, nResults);

  console.error(`[LocalSearch] Found ${scoredDocs.length} matching docs`);

  return scoredDocs.map((item) => ({
    content: extractContext(item.doc.content, queryTerms),
    metadata: {
      source: item.doc.filePath,
      title: item.doc.title,
      category: item.doc.category,
      subcategory: item.doc.subcategory,
    },
    score: item.score,
  }));
}

// 카테고리 매핑
const categoryMapping: Record<string, string> = {
  paradigm: "paradigms",
  tradition: "traditions",
  method: "methods",
  quality: "methods",
  concept: "exemplars",
  journal: "journals",
};

/**
 * 지식베이스 통계
 */
export function getKnowledgeStats(): { total: number; byCategory: Record<string, number> } {
  const byCategory: Record<string, number> = {};

  for (const doc of knowledgeCache) {
    byCategory[doc.category] = (byCategory[doc.category] || 0) + 1;
  }

  return {
    total: knowledgeCache.length,
    byCategory,
  };
}
