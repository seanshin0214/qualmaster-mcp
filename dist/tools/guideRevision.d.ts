export declare const guideRevisionSchema: {
    readonly type: "object";
    readonly properties: {
        readonly rejection_pattern: {
            readonly type: "string";
            readonly description: "진단된 리젝션 패턴 (예: so_what, old_wine, logic_gap 등)";
        };
        readonly original_content: {
            readonly type: "string";
            readonly description: "원본 내용";
        };
        readonly reviewer_comment: {
            readonly type: "string";
            readonly description: "대응할 리뷰어 코멘트";
        };
    };
    readonly required: readonly ["reviewer_comment"];
};
export declare function guideRevision(args: Record<string, unknown>): Promise<{
    reviewer_comment_analysis: {
        comment_type: "concern" | "critique" | "suggestion" | "question" | "praise";
        type_korean: string;
        tone: string;
        requires_major_change: boolean;
        key_concerns: string[];
    };
    recommended_strategies: {
        strategy: string;
        korean: string;
        description: string;
        when_to_use: string;
    }[];
    response_letter_template: string;
    pattern_specific_advice: Record<string, string[]> | null;
    revision_checklist: string[];
    dos_and_donts: Record<string, string[]>;
    example_responses: string[];
}>;
//# sourceMappingURL=guideRevision.d.ts.map