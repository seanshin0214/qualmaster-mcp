export declare const detectSaturationSchema: {
    readonly type: "object";
    readonly properties: {
        readonly codes: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "전체 코드 목록";
        };
        readonly new_codes_by_source: {
            readonly type: "object";
            readonly description: "데이터 소스별 새 코드 (예: {source1: [code1, code2], source2: [...]})";
        };
        readonly level: {
            readonly type: "string";
            readonly enum: readonly ["code", "theme", "theoretical"];
            readonly description: "포화 수준";
        };
    };
    readonly required: readonly ["codes"];
};
export declare function detectSaturation(args: Record<string, unknown>): Promise<{
    level: "code" | "theme" | "theoretical";
    metrics: {
        total_codes: number;
        total_sources: number;
        new_code_rate: string;
        estimated_saturation_point: string;
    };
    assessment: {
        status: "not_reached" | "approaching" | "reached" | "exceeded";
        status_korean: string;
        confidence: string;
        evidence: string[];
    };
    cumulative_analysis: {
        codes_by_source: number[];
        new_codes_by_source: number[];
        trend: string;
    };
    recommendations: string[];
    saturation_guidelines: Record<string, string>;
    next_steps: string[];
}>;
//# sourceMappingURL=detectSaturation.d.ts.map