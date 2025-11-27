export declare const assessQualitySchema: {
    readonly type: "object";
    readonly properties: {
        readonly research_description: {
            readonly type: "string";
            readonly description: "연구 설명";
        };
        readonly strategies_used: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "사용한 전략 (예: 삼각화, 동료검토, 참여자확인 등)";
        };
        readonly criteria: {
            readonly type: "string";
            readonly enum: readonly ["lincoln_guba", "tracy", "all"];
            readonly description: "평가 기준";
        };
    };
    readonly required: readonly ["research_description"];
};
export declare function assessQuality(args: Record<string, unknown>): Promise<{
    criteria_used: "all" | "lincoln_guba" | "tracy";
    input_summary: {
        description_length: number;
        strategies_reported: number;
    };
    overall_assessment: {
        score: string;
        percentage: string;
        grade: string;
    };
    detailed_assessment: {
        criterion: string;
        korean: string;
        score: string;
        strategies_applied: string[];
        missing_strategies: string[];
        recommendations: string[];
    }[];
    summary: {
        strengths: string[];
        weaknesses: string[];
        priority_actions: string[];
    };
    quality_enhancement_guide: Record<string, string[]>;
}>;
//# sourceMappingURL=assessQuality.d.ts.map