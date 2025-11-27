/**
 * Prompt templates for Dr. QualMaster MCP Server
 */
export declare const PROMPTS: {
    suggestMethodology: string;
    autoCoding: string;
    extractThemes: string;
    assessQuality: string;
    conceptualizeIdea: string;
    developProposition: string;
    reviewPaper: string;
    diagnoseRejection: string;
    guideRevision: string;
};
/**
 * Fill template with values
 */
export declare function fillTemplate(template: string, values: Record<string, string | string[] | undefined>): string;
//# sourceMappingURL=prompts.d.ts.map