export declare const autoCodingSchema: {
    readonly type: "object";
    readonly properties: {
        readonly text: {
            readonly type: "string";
            readonly description: "코딩할 텍스트";
        };
        readonly methodology: {
            readonly type: "string";
            readonly description: "적용 방법론 (예: grounded_theory, phenomenology)";
        };
        readonly existing_codes: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "기존 코드 목록";
        };
    };
    readonly required: readonly ["text"];
};
interface CodeSuggestion {
    code: string;
    type: "in_vivo" | "descriptive" | "interpretive" | "pattern";
    segment: string;
    rationale: string;
}
export declare function autoCoding(args: Record<string, unknown>): Promise<{
    methodology: string;
    text_length: number;
    segments_analyzed: number;
    existing_codes_count: number;
    suggested_codes: {
        total: number;
        by_type: {
            in_vivo: number;
            descriptive: number;
            interpretive: number;
            pattern: number;
        };
    };
    codes: CodeSuggestion[];
    coding_guidelines: Record<string, string[]>;
    next_steps: string[];
}>;
export {};
//# sourceMappingURL=autoCoding.d.ts.map