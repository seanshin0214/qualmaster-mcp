/**
 * Local File-based Search for Dr. QualMaster
 * ChromaDB 없이 작동하는 로컬 파일 기반 검색 시스템
 */
/**
 * 지식베이스 로드
 */
export declare function loadKnowledgeBase(): Promise<void>;
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
export declare function searchLocal(query: string, category?: string, nResults?: number): Promise<LocalSearchResult[]>;
/**
 * 지식베이스 통계
 */
export declare function getKnowledgeStats(): {
    total: number;
    byCategory: Record<string, number>;
};
//# sourceMappingURL=localSearch.d.ts.map