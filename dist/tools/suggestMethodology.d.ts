export declare const suggestMethodologySchema: {
    readonly type: "object";
    readonly properties: {
        readonly research_question: {
            readonly type: "string";
            readonly description: "연구 질문";
        };
        readonly purpose: {
            readonly type: "string";
            readonly enum: readonly ["explore", "describe", "explain", "evaluate"];
            readonly description: "연구 목적";
        };
        readonly participants: {
            readonly type: "string";
            readonly description: "참여자 특성";
        };
        readonly data_type: {
            readonly type: "string";
            readonly description: "데이터 유형";
        };
    };
    readonly required: readonly ["research_question"];
};
export declare function suggestMethodology(args: Record<string, unknown>): Promise<{
    research_question: string;
    purpose: string;
    question_analysis: QuestionAnalysis;
    recommendations: {
        rank: number;
        methodology: string;
        korean_name: string;
        fit_score: string;
        reasons: string[];
        considerations: string[];
    }[];
    top_recommendation: {
        methodology: string;
        why: string[];
        next_steps: string[];
    };
    alternative_considerations: string[];
}>;
interface QuestionAnalysis {
    keywords: string[];
    questionType: string;
    focusArea: string;
    hasProcessFocus: boolean;
    hasExperienceFocus: boolean;
    hasCultureFocus: boolean;
    hasStoryFocus: boolean;
    hasContextFocus: boolean;
}
export {};
//# sourceMappingURL=suggestMethodology.d.ts.map