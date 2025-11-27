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
}>;
//# sourceMappingURL=reviewPaper.d.ts.map