import { z } from "zod";
export const assessQualitySchema = {
    type: "object",
    properties: {
        research_description: {
            type: "string",
            description: "연구 설명",
        },
        strategies_used: {
            type: "array",
            items: { type: "string" },
            description: "사용한 전략 (예: 삼각화, 동료검토, 참여자확인 등)",
        },
        criteria: {
            type: "string",
            enum: ["lincoln_guba", "tracy", "all"],
            description: "평가 기준",
        },
    },
    required: ["research_description"],
};
const inputSchema = z.object({
    research_description: z.string(),
    strategies_used: z.array(z.string()).optional().default([]),
    criteria: z.enum(["lincoln_guba", "tracy", "all"]).optional().default("all"),
});
// 키워드 정규화 함수 - 띄어쓰기, 언더스코어 등을 무시하고 비교
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[\s_\-]/g, "") // 공백, 언더스코어, 하이픈 제거
        .replace(/확인/g, "확인")
        .replace(/검증/g, "검토"); // 검증과 검토를 동일하게 처리
}
// 확장된 키워드 매칭 - 다양한 변형 포함
function matchesKeyword(text, keywords) {
    const normalizedText = normalizeText(text);
    return keywords.some(keyword => {
        const normalizedKeyword = normalizeText(keyword);
        return normalizedText.includes(normalizedKeyword) ||
            normalizedKeyword.includes(normalizedText);
    });
}
export async function assessQuality(args) {
    // Defensive coding: 인자가 없거나 undefined인 경우 친절한 에러 메시지 반환
    if (!args || typeof args !== 'object') {
        return {
            error: true,
            message: "assess_quality 도구에 필수 인자가 전달되지 않았습니다.",
            required_parameters: {
                research_description: "(필수) 연구 설명 - 연구 설계, 데이터 수집, 분석 방법 등을 기술하세요",
                strategies_used: "(선택) 사용한 품질 전략 배열 - 예: ['삼각검증', '참여자확인', '동료검토']",
                criteria: "(선택) 평가 기준 - 'lincoln_guba', 'tracy', 또는 'all' (기본값: 'all')"
            },
            example_usage: {
                research_description: "IPA 방법론을 사용한 질적연구. 심층면담과 참여관찰을 통해 데이터 수집. 삼각검증과 참여자 확인 실시.",
                strategies_used: ["삼각검증", "참여자확인", "감사추적"],
                criteria: "all"
            },
            hint: "파일이나 URL의 내용을 먼저 읽어서 research_description에 전달해주세요."
        };
    }
    // research_description 필수 체크
    if (!args.research_description || typeof args.research_description !== 'string' || args.research_description.trim() === '') {
        return {
            error: true,
            message: "research_description(연구 설명)은 필수 입력값입니다.",
            required_parameters: {
                research_description: "(필수) 연구 설명 - 연구 설계, 데이터 수집, 분석 방법 등을 기술하세요"
            },
            example: "IPA 방법론을 사용한 질적연구. 심층면담과 참여관찰을 통해 데이터 수집. 삼각검증과 참여자 확인 실시.",
            hint: "파일이나 URL의 내용을 먼저 읽어서 research_description에 전달해주세요."
        };
    }
    const { research_description, strategies_used, criteria } = inputSchema.parse(args);
    const assessments = [];
    if (criteria === "lincoln_guba" || criteria === "all") {
        assessments.push(...assessLincolnGuba(research_description, strategies_used));
    }
    if (criteria === "tracy" || criteria === "all") {
        assessments.push(...assessTracy(research_description, strategies_used));
    }
    // Calculate overall score
    const totalScore = assessments.reduce((sum, a) => sum + a.score, 0);
    const maxScore = assessments.reduce((sum, a) => sum + a.max_score, 0);
    const overallPercentage = ((totalScore / maxScore) * 100).toFixed(1);
    // Identify strengths and weaknesses
    const strengths = assessments
        .filter((a) => a.score / a.max_score >= 0.7)
        .map((a) => a.korean);
    const weaknesses = assessments
        .filter((a) => a.score / a.max_score < 0.5)
        .map((a) => a.korean);
    return {
        criteria_used: criteria,
        input_summary: {
            description_length: research_description.length,
            strategies_reported: strategies_used.length,
        },
        overall_assessment: {
            score: `${totalScore}/${maxScore}`,
            percentage: `${overallPercentage}%`,
            grade: getGrade(parseFloat(overallPercentage)),
        },
        detailed_assessment: assessments.map((a) => ({
            criterion: a.criterion,
            korean: a.korean,
            score: `${a.score}/${a.max_score}`,
            strategies_applied: a.strategies_applied,
            missing_strategies: a.missing_strategies,
            recommendations: a.recommendations,
        })),
        summary: {
            strengths,
            weaknesses,
            priority_actions: getPriorityActions(assessments),
        },
        quality_enhancement_guide: getQualityEnhancementGuide(),
    };
}
function assessLincolnGuba(description, strategies) {
    const lowerDesc = description.toLowerCase();
    const normalizedDesc = normalizeText(description);
    const normalizedStrategies = strategies.map(s => normalizeText(s));
    const criteria = [
        {
            criterion: "credibility",
            korean: "신빙성 (Credibility)",
            strategies: [
                {
                    name: "prolonged_engagement",
                    korean: "장기적 관여",
                    keywords: ["장기", "오랜기간", "prolonged", "7일", "14일", "집중적관여", "지속적"]
                },
                {
                    name: "triangulation",
                    korean: "삼각화/삼각검증",
                    keywords: ["삼각화", "삼각검증", "triangulation", "다중자료", "3중", "인터뷰+저널", "다중출처"]
                },
                {
                    name: "peer_debriefing",
                    korean: "동료 검토",
                    keywords: ["동료검토", "동료검증", "peer", "debriefing", "동료연구자"]
                },
                {
                    name: "member_checking",
                    korean: "참여자 확인",
                    keywords: ["참여자확인", "membercheck", "memberchecking", "참여자검토", "2단계확인"]
                },
                {
                    name: "negative_case",
                    korean: "부정적 사례 분석",
                    keywords: ["부정적사례", "negativecase", "반증", "방해경험", "부정사례"]
                },
            ],
        },
        {
            criterion: "transferability",
            korean: "전이가능성 (Transferability)",
            strategies: [
                {
                    name: "thick_description",
                    korean: "두꺼운 기술",
                    keywords: ["두꺼운기술", "thickdescription", "상세기술", "풍부한기술"]
                },
                {
                    name: "purposeful_sampling",
                    korean: "목적적 표본추출",
                    keywords: ["목적적", "purposeful", "의도적표집", "목적표집", "목적적표본", "목적표본"]
                },
                {
                    name: "context_description",
                    korean: "맥락 기술",
                    keywords: ["맥락", "context", "배경", "상황기술", "맥락상세", "맥락체크리스트"]
                },
            ],
        },
        {
            criterion: "dependability",
            korean: "의존가능성 (Dependability)",
            strategies: [
                {
                    name: "audit_trail",
                    korean: "감사 추적",
                    keywords: ["감사추적", "audittrail", "연구일지", "감사로그", "추적로그"]
                },
                {
                    name: "code_recode",
                    korean: "코드-재코드",
                    keywords: ["재코드", "recode", "반복코딩", "코드재코드", "일치율", "코딩일치"]
                },
                {
                    name: "peer_examination",
                    korean: "동료 검증",
                    keywords: ["동료검증", "동료검토", "peerexamination", "동료심사"]
                },
            ],
        },
        {
            criterion: "confirmability",
            korean: "확인가능성 (Confirmability)",
            strategies: [
                {
                    name: "reflexivity",
                    korean: "반성성/성찰",
                    keywords: ["반성", "reflexiv", "성찰", "반성적저널", "위치성", "저널링"]
                },
                {
                    name: "audit_trail",
                    korean: "감사 추적",
                    keywords: ["감사추적", "audittrail", "감사로그"]
                },
                {
                    name: "triangulation",
                    korean: "삼각화/삼각검증",
                    keywords: ["삼각화", "삼각검증", "triangulation", "3중"]
                },
            ],
        },
    ];
    return criteria.map((c) => {
        const applied = [];
        const missing = [];
        for (const strategy of c.strategies) {
            // 1. description에서 키워드 찾기
            const foundInDesc = strategy.keywords.some(k => normalizedDesc.includes(normalizeText(k)) || lowerDesc.includes(k.toLowerCase()));
            // 2. strategies_used 배열에서 찾기
            const foundInStrategies = normalizedStrategies.some(s => strategy.keywords.some(k => {
                const nk = normalizeText(k);
                return s.includes(nk) || nk.includes(s);
            }));
            if (foundInDesc || foundInStrategies) {
                applied.push(strategy.korean);
            }
            else {
                missing.push(strategy.korean);
            }
        }
        const score = Math.round((applied.length / c.strategies.length) * 25);
        return {
            criterion: c.criterion,
            korean: c.korean,
            score,
            max_score: 25,
            strategies_applied: applied,
            missing_strategies: missing,
            recommendations: missing.length > 0
                ? missing.map((m) => `${m} 전략을 추가로 적용하세요`)
                : [],
        };
    });
}
function assessTracy(description, strategies) {
    const lowerDesc = description.toLowerCase();
    const normalizedDesc = normalizeText(description);
    const normalizedStrategies = strategies.map(s => normalizeText(s));
    // Tracy의 8가지 기준 - 키워드 대폭 확장
    const criteria = [
        {
            criterion: "worthy_topic",
            korean: "가치있는 주제",
            indicators: [
                "중요", "시의적절", "필요", "기여", "문제", "의미", "가치",
                "새로운현상", "AI", "리더", "의사결정", "탐구", "연구목적"
            ],
        },
        {
            criterion: "rich_rigor",
            korean: "풍부한 엄격성",
            indicators: [
                "충분한", "다양한", "적절한", "체계적", "면밀한", "엄격",
                "IPA", "6단계", "다중사례", "심층", "분석절차", "브라케팅"
            ],
        },
        {
            criterion: "sincerity",
            korean: "성실성",
            indicators: [
                "반성", "성찰", "한계", "투명", "정직", "위치성",
                "반성적저널", "저널링", "솔직"
            ],
        },
        {
            criterion: "credibility",
            korean: "신빙성",
            indicators: [
                "삼각", "참여자확인", "두꺼운기술", "구체적", "검증",
                "membercheck", "삼각검증", "동료검토"
            ],
        },
        {
            criterion: "resonance",
            korean: "공명",
            indicators: [
                "전이", "일반화", "독자", "영향", "감동", "공감",
                "경험", "의미", "본질", "통찰"
            ],
        },
        {
            criterion: "significant_contribution",
            korean: "의미있는 기여",
            indicators: [
                "기여", "확장", "새로운", "발전", "함의", "이론적",
                "실무적", "통찰", "제안"
            ],
        },
        {
            criterion: "ethics",
            korean: "윤리성",
            indicators: [
                "윤리", "동의", "익명", "보호", "IRB", "승인",
                "동의서", "철회", "민감정보", "익명화"
            ],
        },
        {
            criterion: "meaningful_coherence",
            korean: "의미있는 일관성",
            indicators: [
                "일관", "연결", "목적", "방법론", "통합", "적합",
                "IPA", "현상학", "연구질문", "분석"
            ],
        },
    ];
    return criteria.map((c) => {
        // description과 strategies 모두에서 indicator 찾기
        const foundIndicators = c.indicators.filter(indicator => {
            const normalizedIndicator = normalizeText(indicator);
            return normalizedDesc.includes(normalizedIndicator) ||
                lowerDesc.includes(indicator.toLowerCase()) ||
                normalizedStrategies.some(s => s.includes(normalizedIndicator));
        });
        const missingIndicators = c.indicators.filter(indicator => {
            const normalizedIndicator = normalizeText(indicator);
            return !normalizedDesc.includes(normalizedIndicator) &&
                !lowerDesc.includes(indicator.toLowerCase()) &&
                !normalizedStrategies.some(s => s.includes(normalizedIndicator));
        });
        // 점수 계산 - 최소 1개만 매치되어도 부분 점수 부여
        const matchRatio = foundIndicators.length / c.indicators.length;
        const score = Math.round(matchRatio * 13);
        return {
            criterion: c.criterion,
            korean: c.korean,
            score,
            max_score: 13,
            strategies_applied: foundIndicators,
            missing_strategies: missingIndicators.slice(0, 3), // 상위 3개만 표시
            recommendations: score < 10 && foundIndicators.length < 3
                ? [`${c.korean} 관련 내용을 보강하세요`]
                : [],
        };
    });
}
function getGrade(percentage) {
    if (percentage >= 90)
        return "A (우수)";
    if (percentage >= 80)
        return "B (양호)";
    if (percentage >= 70)
        return "C (보통)";
    if (percentage >= 60)
        return "D (미흡)";
    return "F (개선 필요)";
}
function getPriorityActions(assessments) {
    return assessments
        .filter((a) => a.score / a.max_score < 0.5)
        .slice(0, 3)
        .map((a) => `${a.korean} 개선: ${a.recommendations[0] || "전략 추가 필요"}`);
}
function getQualityEnhancementGuide() {
    return {
        immediate_actions: [
            "연구 설계 단계에서 품질 전략을 계획하세요",
            "연구 일지를 꾸준히 작성하세요",
            "동료 연구자와 정기적으로 토론하세요",
        ],
        during_data_collection: [
            "참여자와 충분한 라포를 형성하세요",
            "면담 후 즉시 메모를 작성하세요",
            "다양한 자료원을 활용하세요",
        ],
        during_analysis: [
            "코딩의 일관성을 검토하세요",
            "참여자 확인(member checking)을 실시하세요",
            "부정적 사례를 적극적으로 찾으세요",
        ],
        writing_phase: [
            "두꺼운 기술로 맥락을 풍부하게 제시하세요",
            "연구자의 위치성을 명시하세요",
            "한계를 솔직하게 논의하세요",
        ],
    };
}
//# sourceMappingURL=assessQuality.js.map