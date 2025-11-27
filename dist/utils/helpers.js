/**
 * Utility functions for Dr. QualMaster MCP Server
 */
/**
 * Truncate text to a maximum length while preserving word boundaries
 */
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0 ? truncated.slice(0, lastSpace) + "..." : truncated + "...";
}
/**
 * Parse markdown content into sections
 */
export function parseMarkdownSections(content) {
    const sections = {};
    const lines = content.split("\n");
    let currentSection = "intro";
    let currentContent = [];
    for (const line of lines) {
        const headerMatch = line.match(/^#{1,3}\s+(.+)$/);
        if (headerMatch) {
            if (currentContent.length > 0) {
                sections[currentSection] = currentContent.join("\n").trim();
            }
            currentSection = headerMatch[1].toLowerCase().replace(/\s+/g, "_");
            currentContent = [];
        }
        else {
            currentContent.push(line);
        }
    }
    if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join("\n").trim();
    }
    return sections;
}
/**
 * Calculate similarity score between two arrays (Jaccard index)
 */
export function calculateJaccardSimilarity(arr1, arr2) {
    const set1 = new Set(arr1.map((s) => s.toLowerCase()));
    const set2 = new Set(arr2.map((s) => s.toLowerCase()));
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size > 0 ? intersection.size / union.size : 0;
}
/**
 * Extract keywords from text
 */
export function extractKeywords(text) {
    const stopWords = new Set([
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
        "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
        "being", "have", "has", "had", "do", "does", "did", "will", "would",
        "could", "should", "may", "might", "must", "shall", "can", "this",
        "that", "these", "those", "it", "its", "i", "you", "he", "she", "we",
        "they", "their", "our", "my", "your", "his", "her"
    ]);
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !stopWords.has(word));
}
/**
 * Format tool response for MCP
 */
export function formatToolResponse(data) {
    if (typeof data === "string")
        return data;
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=helpers.js.map