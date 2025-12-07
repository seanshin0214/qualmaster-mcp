import { z } from "zod";
export const extractThemesSchema = {
    type: "object",
    properties: {
        codes: {
            type: "array",
            items: { type: "string" },
            description: "코드 목록",
        },
        segments: {
            type: "array",
            items: { type: "string" },
            description: "코딩된 세그먼트",
        },
        mode: {
            type: "string",
            enum: ["inductive", "deductive"],
            description: "분석 모드",
        },
    },
    required: ["codes"],
};
const inputSchema = z.object({
    codes: z.array(z.string()),
    segments: z.array(z.string()).optional().default([]),
    mode: z.enum(["inductive", "deductive"]).optional().default("inductive"),
});
export async function extractThemes(args) {
    // Defensive coding
    if (!args || typeof args !== 'object' || !args.codes || !Array.isArray(args.codes) || args.codes.length === 0) {
        return {
            error: true,
            message: "extract_themes 도구에 필수 인자 'codes'가 전달되지 않았습니다.",
            required_parameters: { codes: "(필수) 코드 목록 배열" },
            example: { codes: ["불안감", "기대감", "적응"], mode: "inductive" }
        };
    }
    const { codes, segments, mode } = inputSchema.parse(args);
    // Cluster codes into potential themes
    const codeClusters = clusterCodes(codes);
    // Generate themes from clusters
    const themes = generateThemes(codeClusters, segments, mode);
    // Identify relationships between themes
    const relationships = identifyRelationships(themes);
    // Create thematic map
    const thematicMap = {
        overarching_theme: deriveOverarchingTheme(themes),
        main_themes: themes,
        relationships,
    };
    return {
        mode,
        input_summary: {
            total_codes: codes.length,
            total_segments: segments.length,
        },
        thematic_analysis: {
            themes_identified: themes.length,
            themes: themes.map((t) => ({
                name: t.name,
                description: t.description,
                code_count: t.codes.length,
                codes: t.codes,
                subthemes: t.subthemes,
            })),
        },
        thematic_map: {
            overarching_theme: thematicMap.overarching_theme,
            relationships: relationships,
        },
        quality_check: {
            theme_coverage: calculateCoverage(codes, themes),
            orphan_codes: findOrphanCodes(codes, themes),
            recommendations: generateRecommendations(themes, codes),
        },
        braun_clarke_checklist: getBraunClarkeChecklist(),
    };
}
function clusterCodes(codes) {
    const clusters = new Map();
    // Simple clustering based on common words
    for (const code of codes) {
        const words = code.split(/\s+/);
        let assigned = false;
        for (const [key, cluster] of clusters) {
            const keyWords = key.split(/\s+/);
            const overlap = words.filter((w) => keyWords.includes(w));
            if (overlap.length > 0) {
                cluster.push(code);
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            clusters.set(code, [code]);
        }
    }
    // Merge small clusters
    const merged = new Map();
    let clusterIndex = 1;
    for (const [, cluster] of clusters) {
        if (cluster.length >= 2) {
            merged.set(`Cluster_${clusterIndex}`, cluster);
            clusterIndex++;
        }
        else {
            // Add to "기타" cluster
            const misc = merged.get("기타") || [];
            misc.push(...cluster);
            merged.set("기타", misc);
        }
    }
    return merged;
}
function generateThemes(clusters, segments, mode) {
    const themes = [];
    for (const [clusterName, codes] of clusters) {
        if (codes.length === 0)
            continue;
        const theme = {
            name: generateThemeName(codes),
            description: generateThemeDescription(codes, mode),
            codes: codes,
            subthemes: codes.length > 3 ? generateSubthemes(codes) : undefined,
            exemplar_quotes: findExemplarQuotes(codes, segments),
        };
        themes.push(theme);
    }
    return themes;
}
function generateThemeName(codes) {
    // Find common patterns in codes
    const words = {};
    for (const code of codes) {
        const codeWords = code.split(/\s+/);
        for (const word of codeWords) {
            if (word.length > 1) {
                words[word] = (words[word] || 0) + 1;
            }
        }
    }
    // Get most frequent meaningful words
    const sorted = Object.entries(words)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2);
    if (sorted.length > 0) {
        return sorted.map((s) => s[0]).join("과 ");
    }
    return `주제_${codes.length}개_코드`;
}
function generateThemeDescription(codes, mode) {
    const prefix = mode === "inductive" ? "데이터에서 도출된" : "이론에 기반한";
    return `${prefix} ${codes.length}개의 코드를 포괄하는 주제`;
}
function generateSubthemes(codes) {
    // Group codes into 2-3 subthemes
    const subthemes = [];
    const chunkSize = Math.ceil(codes.length / 3);
    for (let i = 0; i < codes.length; i += chunkSize) {
        const chunk = codes.slice(i, i + chunkSize);
        subthemes.push(`하위주제: ${chunk[0]}`);
    }
    return subthemes;
}
function findExemplarQuotes(codes, segments) {
    const quotes = [];
    for (const segment of segments) {
        for (const code of codes) {
            if (segment.toLowerCase().includes(code.toLowerCase())) {
                quotes.push(segment.slice(0, 100) + (segment.length > 100 ? "..." : ""));
                break;
            }
        }
        if (quotes.length >= 2)
            break;
    }
    return quotes;
}
function identifyRelationships(themes) {
    const relationships = [];
    for (let i = 0; i < themes.length; i++) {
        for (let j = i + 1; j < themes.length; j++) {
            const overlap = themes[i].codes.filter((c) => themes[j].codes.some((c2) => c.includes(c2) || c2.includes(c)));
            if (overlap.length > 0) {
                relationships.push({
                    from: themes[i].name,
                    to: themes[j].name,
                    type: "연관",
                });
            }
        }
    }
    return relationships;
}
function deriveOverarchingTheme(themes) {
    if (themes.length === 0)
        return "주제 없음";
    if (themes.length === 1)
        return themes[0].name;
    return `${themes[0].name}을(를) 중심으로 한 ${themes.length}개 주제의 통합적 이해`;
}
function calculateCoverage(codes, themes) {
    const themedCodes = new Set(themes.flatMap((t) => t.codes));
    const coverage = (themedCodes.size / codes.length) * 100;
    return `${coverage.toFixed(1)}%`;
}
function findOrphanCodes(codes, themes) {
    const themedCodes = new Set(themes.flatMap((t) => t.codes));
    return codes.filter((c) => !themedCodes.has(c));
}
function generateRecommendations(themes, codes) {
    const recommendations = [];
    if (themes.length < 3) {
        recommendations.push("더 세분화된 주제 도출을 고려하세요");
    }
    if (themes.length > 7) {
        recommendations.push("주제를 통합하여 더 추상적인 수준으로 발전시키세요");
    }
    const avgCodesPerTheme = codes.length / themes.length;
    if (avgCodesPerTheme < 2) {
        recommendations.push("코드를 더 수집하여 주제를 뒷받침하세요");
    }
    recommendations.push("각 주제에 대한 두꺼운 기술(thick description)을 작성하세요");
    return recommendations;
}
function getBraunClarkeChecklist() {
    return {
        "1_데이터에_충실한_코딩": "확인 필요",
        "2_주제_내_일관성": "확인 필요",
        "3_주제_간_구분": "확인 필요",
        "4_주제의_데이터_뒷받침": "확인 필요",
        "5_주제명의_적절성": "확인 필요",
        "6_전체_이야기와의_연결": "확인 필요",
    };
}
//# sourceMappingURL=extractThemes.js.map