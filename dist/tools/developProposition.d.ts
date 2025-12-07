export declare const developPropositionSchema: {
    readonly type: "object";
    readonly properties: {
        readonly concept: {
            readonly type: "string";
            readonly description: "핵심 개념";
        };
        readonly relationships: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "관계 변수들";
        };
        readonly mechanism: {
            readonly type: "string";
            readonly description: "제안 메커니즘";
        };
    };
    readonly required: readonly ["concept"];
};
export declare function developProposition(args: Record<string, unknown>): Promise<{
    error: boolean;
    message: string;
    required_parameters: {
        concept: string;
    };
    example: {
        concept: string;
        relationships: string[];
    };
    focal_concept?: undefined;
    related_variables?: undefined;
    proposed_mechanism?: undefined;
    propositions?: undefined;
    theoretical_model?: undefined;
    proposition_quality_checklist?: undefined;
    writing_guidelines?: undefined;
    next_steps?: undefined;
} | {
    focal_concept: string;
    related_variables: string[];
    proposed_mechanism: string;
    propositions: {
        id: string;
        type: "mechanism" | "antecedent" | "outcome" | "moderator" | "mediator";
        type_korean: string;
        statement: string;
        variables_involved: string[];
        direction: string;
        boundary_conditions: string;
        testability: string;
    }[];
    theoretical_model: {
        structure: string;
        visual_representation: string;
        key_relationships: string[];
    };
    proposition_quality_checklist: Record<string, string>;
    writing_guidelines: {
        proposition_format: string;
        examples: string[];
    };
    next_steps: string[];
    error?: undefined;
    message?: undefined;
    required_parameters?: undefined;
    example?: undefined;
}>;
//# sourceMappingURL=developProposition.d.ts.map