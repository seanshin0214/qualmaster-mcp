import { z } from "zod";
export const autoCodingSchema = {
    type: "object",
    properties: {
        text: {
            type: "string",
            description: "코딩할 텍스트",
        },
        methodology: {
            type: "string",
            description: "적용 방법론 (예: grounded_theory, phenomenology)",
        },
        existing_codes: {
            type: "array",
            items: { type: "string" },
            description: "기존 코드 목록",
        },
    },
    required: ["text"],
};
const inputSchema = z.object({
    text: z.string(),
    methodology: z.string().optional().default("grounded_theory"),
    existing_codes: z.array(z.string()).optional().default([]),
});
export async function autoCoding(args) {
    const { text, methodology, existing_codes } = inputSchema.parse(args);
    // Analyze text segments
    const segments = segmentText(text);
    const suggestions = [];
    for (const segment of segments) {
        const segmentCodes = generateCodesForSegment(segment, methodology, existing_codes);
        suggestions.push(...segmentCodes);
    }
    // Group by code type
    const groupedCodes = {
        in_vivo: suggestions.filter((s) => s.type === "in_vivo"),
        descriptive: suggestions.filter((s) => s.type === "descriptive"),
        interpretive: suggestions.filter((s) => s.type === "interpretive"),
        pattern: suggestions.filter((s) => s.type === "pattern"),
    };
    return {
        methodology,
        text_length: text.length,
        segments_analyzed: segments.length,
        existing_codes_count: existing_codes.length,
        suggested_codes: {
            total: suggestions.length,
            by_type: {
                in_vivo: groupedCodes.in_vivo.length,
                descriptive: groupedCodes.descriptive.length,
                interpretive: groupedCodes.interpretive.length,
                pattern: groupedCodes.pattern.length,
            },
        },
        codes: suggestions,
        coding_guidelines: getCodingGuidelines(methodology),
        next_steps: [
            "제안된 코드를 검토하고 수정하세요",
            "맥락에 맞지 않는 코드는 제거하세요",
            "추가 코드가 필요하면 직접 생성하세요",
            "코드 간 관계를 메모로 기록하세요",
        ],
    };
}
function segmentText(text) {
    // Split by sentences or meaningful units
    const sentences = text
        .split(/[.!?。]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 10);
    return sentences;
}
function generateCodesForSegment(segment, methodology, existingCodes) {
    const codes = [];
    // Extract potential in-vivo codes (participant's own words)
    const quotedPhrases = segment.match(/"[^"]+"|'[^']+'/g);
    if (quotedPhrases) {
        for (const phrase of quotedPhrases) {
            codes.push({
                code: phrase.replace(/['"]/g, ""),
                type: "in_vivo",
                segment: segment,
                rationale: "참여자의 직접적인 표현 (in-vivo)",
            });
        }
    }
    // Generate descriptive codes based on key concepts
    const descriptiveCodes = extractDescriptiveCodes(segment);
    for (const code of descriptiveCodes) {
        if (!existingCodes.includes(code)) {
            codes.push({
                code,
                type: "descriptive",
                segment: segment,
                rationale: "텍스트의 주요 내용을 기술",
            });
        }
    }
    // Generate interpretive codes based on methodology
    const interpretiveCodes = generateInterpretiveCodes(segment, methodology);
    for (const code of interpretiveCodes) {
        codes.push({
            code,
            type: "interpretive",
            segment: segment,
            rationale: `${methodology} 관점에서의 해석`,
        });
    }
    return codes;
}
function extractDescriptiveCodes(segment) {
    const codes = [];
    // Korean action/emotion keywords
    const actionPatterns = [
        /([가-힣]+하다)/g,
        /([가-힣]+되다)/g,
        /([가-힣]+느끼다)/g,
        /([가-힣]+생각하다)/g,
    ];
    for (const pattern of actionPatterns) {
        const matches = segment.match(pattern);
        if (matches) {
            codes.push(...matches.slice(0, 2));
        }
    }
    // Extract noun phrases
    const nounPatterns = [/([가-힣]+의\s[가-힣]+)/g, /([가-힣]+[이가]\s[가-힣]+)/g];
    for (const pattern of nounPatterns) {
        const matches = segment.match(pattern);
        if (matches) {
            codes.push(...matches.slice(0, 1));
        }
    }
    return [...new Set(codes)].slice(0, 3);
}
function generateInterpretiveCodes(segment, methodology) {
    const codes = [];
    // Methodology-specific interpretive lenses
    const lenses = {
        grounded_theory: ["과정", "상호작용", "전략", "조건", "결과"],
        phenomenology: ["경험의 본질", "의미", "지향성", "생활세계"],
        ethnography: ["문화적 패턴", "공유된 의미", "사회적 관행"],
        narrative: ["줄거리", "전환점", "정체성", "시간성"],
    };
    const methodologyLenses = lenses[methodology] || lenses.grounded_theory;
    // Check for lens-related content
    for (const lens of methodologyLenses) {
        if (segment.includes(lens) || hasRelatedConcept(segment, lens)) {
            codes.push(`[${lens}] ${summarizeSegment(segment)}`);
        }
    }
    return codes.slice(0, 2);
}
function hasRelatedConcept(segment, lens) {
    const relatedTerms = {
        과정: ["변화", "단계", "발전", "진행"],
        상호작용: ["관계", "소통", "대화", "협력"],
        전략: ["방법", "대응", "해결", "극복"],
        경험의본질: ["느낌", "감정", "인식", "체험"],
        의미: ["뜻", "가치", "중요", "의의"],
    };
    const terms = relatedTerms[lens] || [];
    return terms.some((term) => segment.includes(term));
}
function summarizeSegment(segment) {
    // Return first 20 characters as summary
    return segment.slice(0, 20) + (segment.length > 20 ? "..." : "");
}
function getCodingGuidelines(methodology) {
    const guidelines = {
        grounded_theory: {
            open_coding: [
                "데이터를 줄 단위로 분석",
                "현상에 이름 붙이기",
                "속성과 차원 파악",
                "지속적 비교",
            ],
            axial_coding: [
                "범주 간 관계 파악",
                "패러다임 모형 적용",
                "하위범주와 상위범주 연결",
            ],
            selective_coding: ["핵심 범주 도출", "이야기 윤곽 작성", "이론 통합"],
        },
        phenomenology: {
            horizontalization: ["모든 진술을 동등하게 취급", "의미 있는 진술 추출"],
            meaning_units: ["의미 단위로 분류", "변형된 의미 진술 작성"],
            essence: ["본질 구조 기술", "개인/전체 본질 통합"],
        },
    };
    return guidelines[methodology] || guidelines.grounded_theory;
}
//# sourceMappingURL=autoCoding.js.map