export declare const searchKnowledgeSchema: {
    readonly type: "object";
    readonly properties: {
        readonly query: {
            readonly type: "string";
            readonly description: "검색 질의";
        };
        readonly category: {
            readonly type: "string";
            readonly enum: readonly ["paradigm", "tradition", "method", "quality", "concept", "journal", "all"];
            readonly description: "검색 카테고리";
        };
        readonly n_results: {
            readonly type: "number";
            readonly description: "반환 결과 수 (기본값: 5)";
        };
    };
    readonly required: readonly ["query"];
};
export declare function searchKnowledge(args: Record<string, unknown>): Promise<{
    message: string;
    query: string;
    category: "all" | "paradigm" | "tradition" | "method" | "quality" | "concept" | "journal";
    suggestions: string[];
    total_results?: undefined;
    results?: undefined;
} | {
    query: string;
    category: "all" | "paradigm" | "tradition" | "method" | "quality" | "concept" | "journal";
    total_results: number;
    results: {
        rank: number;
        content: string;
        source: string | number | true;
        relevance_score: string;
    }[];
    message?: undefined;
    suggestions?: undefined;
}>;
//# sourceMappingURL=searchKnowledge.d.ts.map