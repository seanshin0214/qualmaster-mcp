export declare const diagnoseRejectionSchema: {
    readonly type: "object";
    readonly properties: {
        readonly reviewer_comments: {
            readonly type: "string";
            readonly description: "리뷰어 코멘트";
        };
        readonly editor_decision: {
            readonly type: "string";
            readonly description: "에디터 결정문";
        };
    };
    readonly required: readonly ["reviewer_comments"];
};
export declare function diagnoseRejection(args: Record<string, unknown>): Promise<{
    error: boolean;
    message: string;
    required_parameters: {
        reviewer_comments: string;
    };
    example: {
        reviewer_comments: string;
    };
    input_summary?: undefined;
    diagnosis?: undefined;
    key_quotes?: undefined;
    severity?: undefined;
    response_strategy?: undefined;
    common_mistakes_to_avoid?: undefined;
    next_steps?: undefined;
} | {
    input_summary: {
        reviewer_comments_length: number;
        has_editor_decision: boolean;
    };
    diagnosis: {
        primary_patterns: {
            pattern: string;
            korean: string;
            confidence: string;
            matched_indicators: string[];
            typical_phrases: string[];
        }[];
        secondary_patterns: {
            pattern: string;
            korean: string;
            confidence: string;
        }[];
    };
    key_quotes: string[];
    severity: {
        level: string;
        korean: string;
        recovery_difficulty: string;
    };
    response_strategy: Record<string, string[]>;
    common_mistakes_to_avoid: string[];
    next_steps: string[];
    error?: undefined;
    message?: undefined;
    required_parameters?: undefined;
    example?: undefined;
}>;
//# sourceMappingURL=diagnoseRejection.d.ts.map