export declare const conceptualizeIdeaSchema: {
    readonly type: "object";
    readonly properties: {
        readonly idea: {
            readonly type: "string";
            readonly description: "초기 아이디어";
        };
        readonly phenomenon: {
            readonly type: "string";
            readonly description: "관련 현상";
        };
        readonly existing_concepts: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "관련 기존 개념";
        };
    };
    readonly required: readonly ["idea"];
};
export declare function conceptualizeIdea(args: Record<string, unknown>): Promise<{
    error: boolean;
    message: string;
    required_parameters: {
        idea: string;
        phenomenon: string;
        existing_concepts: string;
    };
    example_usage: {
        idea: string;
        phenomenon: string;
        existing_concepts: string[];
    };
    hint: string;
    original_idea?: undefined;
    phenomenon?: undefined;
    existing_concepts_considered?: undefined;
    idea_analysis?: undefined;
    concept_development?: undefined;
    differentiation_from_existing?: undefined;
    theoretical_positioning?: undefined;
    related_literature?: undefined;
    next_steps?: undefined;
    concept_paper_structure?: undefined;
} | {
    original_idea: string;
    phenomenon: string;
    existing_concepts_considered: string[];
    idea_analysis: {
        core_insight: string;
        key_elements: string[];
        potential_scope: string;
    };
    concept_development: {
        proposed_name: string;
        alternative_names: string[];
        definition: string;
        core_attributes: string[];
        boundary_conditions: string[];
    };
    differentiation_from_existing: {
        existing_concepts: string[];
        how_different: string;
        unique_contribution: string[];
    };
    theoretical_positioning: {
        suggested_position: string;
        related_theories: string[];
        integration_possibilities: string[];
    };
    related_literature: {
        content: string;
        relevance: string;
    }[];
    next_steps: string[];
    concept_paper_structure: Record<string, string[]>;
    error?: undefined;
    message?: undefined;
    required_parameters?: undefined;
    example_usage?: undefined;
    hint?: undefined;
}>;
//# sourceMappingURL=conceptualizeIdea.d.ts.map