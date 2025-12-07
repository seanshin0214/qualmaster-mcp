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
    error: boolean;
    message: string;
    required_parameters: {
        research_description: string;
        strategies_used: string;
        criteria: string;
    };
    example_usage: {
        research_description: string;
        strategies_used: string[];
        criteria: string;
    };
    hint: string;
    example?: undefined;
    criteria_used?: undefined;
    input_summary?: undefined;
    overall_assessment?: undefined;
    detailed_assessment?: undefined;
    summary?: undefined;
    quality_enhancement_guide?: undefined;
} | {
    error: boolean;
    message: string;
    required_parameters: {
        research_description: string;
        strategies_used?: undefined;
        criteria?: undefined;
    };
    example: string;
    hint: string;
    example_usage?: undefined;
    criteria_used?: undefined;
    input_summary?: undefined;
    overall_assessment?: undefined;
    detailed_assessment?: undefined;
    summary?: undefined;
    quality_enhancement_guide?: undefined;
} | {
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
    error?: undefined;
    message?: undefined;
    required_parameters?: undefined;
    example_usage?: undefined;
    hint?: undefined;
    example?: undefined;
}>;
//# sourceMappingURL=assessQuality.d.ts.map