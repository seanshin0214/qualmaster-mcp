import { getCollection, isVectorSearchAvailable } from "./client.js";
import { COLLECTIONS, CollectionCategory } from "./collections.js";
import { searchLocal, loadKnowledgeBase, getKnowledgeStats } from "./localSearch.js";
import type { Metadata } from "chromadb";

export interface SearchResult {
  content: string;
  metadata: Record<string, string | number | boolean>;
  distance?: number;
}

export async function searchKnowledgeBase(
  query: string,
  category: CollectionCategory | "all" = "all",
  nResults: number = 5
): Promise<SearchResult[]> {
  // ChromaDB가 없으면 로컬 파일 기반 검색 사용
  if (!isVectorSearchAvailable()) {
    const localResults = await searchLocal(query, category, nResults);

    if (localResults.length === 0) {
      const stats = getKnowledgeStats();
      return [{
        content: `지식베이스에서 "${query}" 관련 내용을 찾지 못했습니다. (총 ${stats.total}개 문서 검색)`,
        metadata: { source: "local_search", type: "notice" },
        distance: 0
      }];
    }

    return localResults.map((r) => ({
      content: r.content,
      metadata: r.metadata as Record<string, string | number | boolean>,
      distance: 1 - (r.score / 100), // Convert score to distance-like metric
    }));
  }

  const collectionsToSearch =
    category === "all"
      ? Object.values(COLLECTIONS).map((c) => c.name)
      : [COLLECTIONS[category]?.name].filter(Boolean);

  const results: SearchResult[] = [];

  for (const collectionName of collectionsToSearch) {
    try {
      const collection = await getCollection(collectionName);
      if (!collection) continue;

      const queryResult = await collection.query({
        queryTexts: [query],
        nResults: nResults,
      });

      if (queryResult.documents[0]) {
        results.push(
          ...queryResult.documents[0].map((doc, i) => ({
            content: doc || "",
            metadata: (queryResult.metadatas[0]?.[i] || {}) as Record<string, string | number | boolean>,
            distance: queryResult.distances?.[0]?.[i],
          }))
        );
      }
    } catch (error) {
      // Silently skip failed collections
    }
  }

  // Sort by relevance (lower distance = more relevant)
  results.sort((a, b) => (a.distance || 0) - (b.distance || 0));

  return results.slice(0, nResults);
}

export async function addDocument(
  collectionName: string,
  id: string,
  content: string,
  metadata: Metadata
): Promise<void> {
  if (!isVectorSearchAvailable()) return;
  const collection = await getCollection(collectionName);
  if (!collection) return;
  await collection.add({
    ids: [id],
    documents: [content],
    metadatas: [metadata],
  });
}

export async function addDocuments(
  collectionName: string,
  ids: string[],
  contents: string[],
  metadatas: Metadata[]
): Promise<void> {
  if (!isVectorSearchAvailable()) return;
  const collection = await getCollection(collectionName);
  if (!collection) return;
  await collection.add({
    ids,
    documents: contents,
    metadatas,
  });
}
