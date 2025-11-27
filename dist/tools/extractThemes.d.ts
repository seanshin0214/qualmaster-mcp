export declare const extractThemesSchema: {
    readonly type: "object";
    readonly properties: {
        readonly codes: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "코드 목록";
        };
        readonly segments: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "코딩된 세그먼트";
        };
        readonly mode: {
            readonly type: "string";
            readonly enum: readonly ["inductive", "deductive"];
            readonly description: "분석 모드";
        };
    };
    readonly required: readonly ["codes"];
};
export declare function extractThemes(args: Record<string, unknown>): Promise<{
    mode: "inductive" | "deductive";
    input_summary: {
        total_codes: number;
        total_segments: number;
    };
    thematic_analysis: {
        themes_identified: number;
        themes: {
            name: string;
            description: string;
            code_count: number;
            codes: string[];
            subthemes: string[] | undefined;
        }[];
    };
    thematic_map: {
        overarching_theme: string | undefined;
        relationships: {
            from: string;
            to: string;
            type: string;
        }[];
    };
    quality_check: {
        theme_coverage: string;
        orphan_codes: string[];
        recommendations: string[];
    };
    braun_clarke_checklist: Record<string, string | boolean>;
}>;
//# sourceMappingURL=extractThemes.d.ts.map