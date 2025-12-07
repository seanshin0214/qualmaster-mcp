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
    error: boolean;
    message: string;
    required_parameters: {
        query: string;
    };
    example: {
        query: string;
        category: string;
    };
    hint: string;
    query?: undefined;
    category?: undefined;
    suggestions?: undefined;
    total_results?: undefined;
    results?: undefined;
} | {
    message: string;
    query: string;
    category: "all" | "paradigm" | "tradition" | "method" | "quality" | "concept" | "journal";
    suggestions: string[];
    error?: undefined;
    required_parameters?: undefined;
    example?: undefined;
    hint?: undefined;
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
    error?: undefined;
    message?: undefined;
    required_parameters?: undefined;
    example?: undefined;
    hint?: undefined;
    suggestions?: undefined;
}>;
//# sourceMappingURL=searchKnowledge.d.ts.map