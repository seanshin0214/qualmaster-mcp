export declare const reviewPaperSchema: {
    readonly type: "object";
    readonly properties: {
        readonly paper_text: {
            readonly type: "string";
            readonly description: "논문 텍스트";
        };
        readonly section: {
            readonly type: "string";
            readonly enum: readonly ["introduction", "literature", "theory", "discussion", "full"];
            readonly description: "평가 섹션";
        };
    };
    readonly required: readonly ["paper_text"];
};
export declare function reviewPaper(args: Record<string, unknown>): Promise<{
    error: boolean;
    message: string;
    required_parameters: {
        paper_text: string;
    };
    example: {
        paper_text: string;
        section: string;
    };
    section_reviewed?: undefined;
    paper_length?: undefined;
    overall_score?: undefined;
    section_scores?: undefined;
    top_improvement_areas?: undefined;
    amr_checklist?: undefined;
    revision_priorities?: undefined;
} | {
    section_reviewed: "introduction" | "discussion" | "literature" | "theory" | "full";
    paper_length: number;
    overall_score: {
        earned: number;
        max: number;
        percentage: string;
        grade: string;
    };
    section_scores: {
        section: string;
        korean: string;
        score: string;
        percentage: string;
        criteria_details: {
            criterion: string;
            max: number;
            earned: number;
            feedback: string;
        }[];
    }[];
    top_improvement_areas: {
        section: string;
        criterion: string;
        current_score: string;
        feedback: string;
    }[];
    amr_checklist: Record<string, string>;
    revision_priorities: string[];
    error?: undefined;
    message?: undefined;
    required_parameters?: undefined;
    example?: undefined;
}>;
//# sourceMappingURL=reviewPaper.d.ts.map