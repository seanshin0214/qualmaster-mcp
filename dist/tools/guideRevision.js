import { z } from "zod";
export const guideRevisionSchema = {
    type: "object",
    properties: {
        rejection_pattern: {
            type: "string",
            description: "진단된 리젝션 패턴 (예: so_what, old_wine, logic_gap 등)",
        },
        original_content: {
            type: "string",
            description: "원본 내용",
        },
        reviewer_comment: {
            type: "string",
            description: "대응할 리뷰어 코멘트",
        },
    },
    required: ["reviewer_comment"],
};
const inputSchema = z.object({
    rejection_pattern: z.string().optional(),
    original_content: z.string().optional(),
    reviewer_comment: z.string(),
});
export async function guideRevision(args) {
    const { rejection_pattern, original_content, reviewer_comment } = inputSchema.parse(args);
    // Analyze the reviewer comment
    const commentAnalysis = analyzeComment(reviewer_comment);
    // Get appropriate strategies
    const strategies = getRevisionStrategies(rejection_pattern, commentAnalysis);
    // Generate response letter template
    const responseTemplate = generateResponseTemplate(reviewer_comment, strategies, original_content);
    // Get pattern-specific advice
    const patternAdvice = rejection_pattern
        ? getPatternSpecificAdvice(rejection_pattern)
        : null;
    return {
        reviewer_comment_analysis: {
            comment_type: commentAnalysis.type,
            type_korean: commentAnalysis.typeKorean,
            tone: commentAnalysis.tone,
            requires_major_change: commentAnalysis.requiresMajorChange,
            key_concerns: commentAnalysis.keyConcerns,
        },
        recommended_strategies: strategies.map((s) => ({
            strategy: s.strategy,
            korean: s.korean,
            description: s.description,
            when_to_use: getWhenToUse(s.strategy),
        })),
        response_letter_template: responseTemplate,
        pattern_specific_advice: patternAdvice,
        revision_checklist: getRevisionChecklist(strategies),
        dos_and_donts: getDosAndDonts(),
        example_responses: getExampleResponses(commentAnalysis.type),
    };
}
function analyzeComment(comment) {
    const lowerComment = comment.toLowerCase();
    // Determine type
    let type = "critique";
    let typeKorean = "비판";
    if (lowerComment.includes("suggest") || lowerComment.includes("recommend") || lowerComment.includes("제안")) {
        type = "suggestion";
        typeKorean = "제안";
    }
    else if (lowerComment.includes("?") || lowerComment.includes("why") || lowerComment.includes("how")) {
        type = "question";
        typeKorean = "질문";
    }
    else if (lowerComment.includes("good") || lowerComment.includes("well") || lowerComment.includes("좋")) {
        type = "praise";
        typeKorean = "긍정적 평가";
    }
    else if (lowerComment.includes("concern") || lowerComment.includes("worry") || lowerComment.includes("우려")) {
        type = "concern";
        typeKorean = "우려 표명";
    }
    // Determine tone
    const negativeWords = ["must", "should", "lack", "fail", "problem", "issue", "부족", "문제"];
    const tone = negativeWords.some((w) => lowerComment.includes(w)) ? "비판적" : "중립적";
    // Major change required?
    const majorChangeWords = ["major", "significant", "fundamental", "substantially", "근본적", "상당한"];
    const requiresMajorChange = majorChangeWords.some((w) => lowerComment.includes(w));
    // Extract key concerns
    const sentences = comment.split(/[.!?]/).filter((s) => s.trim().length > 10);
    const keyConcerns = sentences.slice(0, 3).map((s) => s.trim());
    return {
        type,
        typeKorean,
        tone,
        requiresMajorChange,
        keyConcerns,
    };
}
function getRevisionStrategies(pattern, analysis) {
    const allStrategies = [
        {
            strategy: "direct_response",
            korean: "직접 대응",
            description: "리뷰어의 지적을 직접 수용하고 수정",
            response_template: "Thank you for this comment. We have revised the manuscript as follows: [구체적 수정 내용]",
            examples: ["문장 수정", "설명 추가", "구조 변경"],
        },
        {
            strategy: "evidence_strengthening",
            korean: "근거 보강",
            description: "추가 증거나 문헌으로 주장 강화",
            response_template: "We appreciate this concern. To address it, we have added [추가 증거/문헌] to strengthen our argument.",
            examples: ["문헌 추가", "데이터 보강", "사례 추가"],
        },
        {
            strategy: "logic_restructuring",
            korean: "논리 재구성",
            description: "논증 구조를 재정리하여 명확성 향상",
            response_template: "We understand the reviewer's concern about clarity. We have restructured the argument as follows: [새 구조 설명]",
            examples: ["단락 재배치", "논리 연결 추가", "도식화"],
        },
        {
            strategy: "scope_adjustment",
            korean: "범위 조정",
            description: "주장의 범위를 조정하여 타당성 확보",
            response_template: "We acknowledge this point and have adjusted our claims to: [조정된 주장]",
            examples: ["일반화 제한", "경계조건 추가", "예외 인정"],
        },
        {
            strategy: "respectful_disagreement",
            korean: "정중한 반박",
            description: "근거를 제시하며 정중하게 다른 견해 표명",
            response_template: "We appreciate this perspective. However, we respectfully maintain our position because: [근거]. We have clarified this in the revised manuscript.",
            examples: ["이론적 근거 제시", "선행연구 인용", "대안적 해석 제시"],
        },
    ];
    // Filter based on pattern and analysis
    if (pattern === "so_what") {
        return allStrategies.filter((s) => ["evidence_strengthening", "direct_response"].includes(s.strategy));
    }
    else if (pattern === "logic_gap") {
        return allStrategies.filter((s) => ["logic_restructuring", "evidence_strengthening"].includes(s.strategy));
    }
    else if (analysis.type === "question") {
        return allStrategies.filter((s) => ["direct_response", "evidence_strengthening"].includes(s.strategy));
    }
    return allStrategies.slice(0, 3);
}
function getWhenToUse(strategy) {
    const whenToUse = {
        direct_response: "리뷰어의 지적이 타당하고 수정이 가능할 때",
        evidence_strengthening: "주장이 맞지만 근거가 약할 때",
        logic_restructuring: "아이디어는 좋지만 표현이 불명확할 때",
        scope_adjustment: "과도한 일반화를 지적받았을 때",
        respectful_disagreement: "리뷰어 의견에 동의하지 않지만 근거가 있을 때",
    };
    return whenToUse[strategy] || "상황에 따라 판단";
}
function generateResponseTemplate(comment, strategies, originalContent) {
    const primaryStrategy = strategies[0];
    return `
## Response to Reviewer Comment

**Original Comment:**
"${comment.slice(0, 200)}${comment.length > 200 ? "..." : ""}"

**Our Response:**

We thank the reviewer for this thoughtful comment.

${primaryStrategy.response_template}

**Specific Changes Made:**
1. [Page X, Line Y]: [구체적 변경 내용 1]
2. [Page X, Line Y]: [구체적 변경 내용 2]

**Rationale:**
[왜 이렇게 수정했는지 설명]

---
(위 템플릿을 상황에 맞게 수정하여 사용하세요)
`.trim();
}
function getPatternSpecificAdvice(pattern) {
    const advice = {
        so_what: {
            core_problem: ["기여도가 명확하지 않음", "왜 중요한지 설득력 부족"],
            revision_focus: [
                "서론에서 '기존 연구의 한계'와 '본 연구의 기여'를 명확히 연결",
                "Discussion에서 이론적/실무적 함의를 구체화",
                "'이 연구가 없다면 무엇을 모르게 되는가?' 질문에 답변",
            ],
        },
        old_wine: {
            core_problem: ["신규성 부족", "기존 개념과의 차별화 실패"],
            revision_focus: [
                "새로운 경계조건, 맥락, 또는 관계 강조",
                "기존 개념과의 명확한 차이점 표 또는 그림으로 제시",
                "새로운 통찰이 가능한 이유 설명",
            ],
        },
        logic_gap: {
            core_problem: ["논리적 비약", "연결고리 부재"],
            revision_focus: [
                "각 단계 사이의 '왜냐하면' 추가",
                "논리 구조를 도식화하여 제시",
                "가정을 명시적으로 진술",
            ],
        },
        boundary_problem: {
            core_problem: ["경계조건 불명확", "적용 범위 모호"],
            revision_focus: [
                "When, Where, Who 조건 명시",
                "적용 가능/불가 상황 구분",
                "명제에 조건절 포함",
            ],
        },
        mechanism_missing: {
            core_problem: ["메커니즘 설명 부재", "'어떻게'에 대한 답변 없음"],
            revision_focus: [
                "인과적 과정을 단계별로 설명",
                "중간 변수나 과정 명시",
                "관련 이론을 활용한 메커니즘 정당화",
            ],
        },
    };
    return advice[pattern] || {
        core_problem: ["패턴에 맞는 분석 필요"],
        revision_focus: ["diagnose_rejection 도구로 먼저 패턴을 진단하세요"],
    };
}
function getRevisionChecklist(strategies) {
    const baseChecklist = [
        "모든 리뷰어 코멘트에 개별적으로 응답했는가?",
        "수정된 위치(페이지, 줄)를 명시했는가?",
        "변경 이유를 설명했는가?",
        "수정본에서 변경 사항을 하이라이트했는가?",
        "응답 톤이 정중하고 감사를 표현하는가?",
    ];
    const strategyChecklist = strategies.flatMap((s) => s.examples.map((e) => `${s.korean} 전략 적용: ${e}`));
    return [...baseChecklist, ...strategyChecklist.slice(0, 3)];
}
function getDosAndDonts() {
    return {
        do: [
            "모든 코멘트에 감사 표현으로 시작",
            "구체적인 변경 사항과 위치 명시",
            "변경 이유를 논리적으로 설명",
            "동의하지 않을 때도 정중하게 표현",
            "리뷰어의 관점을 인정한 후 반박",
        ],
        dont: [
            "방어적이거나 공격적인 톤 사용",
            "코멘트 무시하거나 대충 넘기기",
            "막연한 수정 약속 (예: '수정하겠습니다'만)",
            "리뷰어의 전문성 의심 표현",
            "감정적인 반응이나 변명",
        ],
    };
}
function getExampleResponses(commentType) {
    const examples = {
        critique: [
            "We appreciate this insightful critique and have substantially revised the section...",
            "Thank you for identifying this weakness. We have addressed it by...",
        ],
        suggestion: [
            "Thank you for this valuable suggestion. We have incorporated it as follows...",
            "We are grateful for this recommendation and have implemented it by...",
        ],
        question: [
            "Thank you for raising this important question. We have clarified this by...",
            "We appreciate this query and have added explanation in Section X...",
        ],
        concern: [
            "We understand the reviewer's concern and have addressed it by...",
            "Thank you for highlighting this issue. We have mitigated it through...",
        ],
        praise: [
            "We thank the reviewer for this positive feedback and have maintained this strength while...",
            "We appreciate this recognition and have built upon it by...",
        ],
    };
    return examples[commentType] || examples.critique;
}
//# sourceMappingURL=guideRevision.js.map