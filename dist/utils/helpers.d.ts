/**
 * Utility functions for Dr. QualMaster MCP Server
 */
/**
 * Truncate text to a maximum length while preserving word boundaries
 */
export declare function truncateText(text: string, maxLength: number): string;
/**
 * Parse markdown content into sections
 */
export declare function parseMarkdownSections(content: string): Record<string, string>;
/**
 * Calculate similarity score between two arrays (Jaccard index)
 */
export declare function calculateJaccardSimilarity(arr1: string[], arr2: string[]): number;
/**
 * Extract keywords from text
 */
export declare function extractKeywords(text: string): string[];
/**
 * Format tool response for MCP
 */
export declare function formatToolResponse(data: unknown): string;
//# sourceMappingURL=helpers.d.ts.map