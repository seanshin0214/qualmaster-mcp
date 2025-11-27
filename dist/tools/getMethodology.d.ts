export declare const getMethodologySchema: {
    readonly type: "object";
    readonly properties: {
        readonly methodology: {
            readonly type: "string";
            readonly enum: readonly ["phenomenology", "grounded_theory", "ethnography", "narrative", "case_study"];
            readonly description: "방법론 ID";
        };
        readonly variant: {
            readonly type: "string";
            readonly description: "세부 변형 (예: IPA, Charmaz, Yin)";
        };
    };
    readonly required: readonly ["methodology"];
};
export declare function getMethodology(args: Record<string, unknown>): Promise<{
    methodology: "phenomenology" | "grounded_theory" | "ethnography" | "narrative" | "case_study";
    korean_name: string;
    description: string;
    variants: string[];
    key_features: string[];
    best_for: string[];
    requested_variant: string;
    additional_resources: {
        content: string;
        source: string | number | boolean;
    }[];
    recommendations: {
        sample_size: string;
        data_collection: string[];
        analysis_approach: string;
    };
}>;
//# sourceMappingURL=getMethodology.d.ts.map