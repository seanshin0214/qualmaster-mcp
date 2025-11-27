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
} as const;

const inputSchema = z.object({
  research_description: z.string(),
  strategies_used: z.array(z.string()).optional().default([]),
  criteria: z.enum(["lincoln_guba", "tracy", "all"]).optional().default("all"),
});

interface CriterionAssessment {
  criterion: string;
  korean: string;
  score: number;
  max_score: number;
  strategies_applied: string[];
  missing_strategies: string[];
  recommendations: string[];
}

export async function assessQuality(args: Record<string, unknown>) {
  const { research_description, strategies_used, criteria } = inputSchema.parse(args);

  const assessments: CriterionAssessment[] = [];

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

function assessLincolnGuba(
  description: string,
  strategies: string[]
): CriterionAssessment[] {
  const lowerDesc = description.toLowerCase();
  const lowerStrategies = strategies.map((s) => s.toLowerCase());

  const criteria = [
    {
      criterion: "credibility",
      korean: "신빙성 (Credibility)",
      strategies: [
        { name: "prolonged_engagement", korean: "장기적 관여", keywords: ["장기", "오랜 기간", "prolonged"] },
        { name: "triangulation", korean: "삼각화", keywords: ["삼각화", "triangulation", "다중"] },
        { name: "peer_debriefing", korean: "동료 검토", keywords: ["동료", "peer", "검토"] },
        { name: "member_checking", korean: "참여자 확인", keywords: ["참여자 확인", "member check"] },
        { name: "negative_case", korean: "부정적 사례 분석", keywords: ["부정적 사례", "negative case", "반증"] },
      ],
    },
    {
      criterion: "transferability",
      korean: "전이가능성 (Transferability)",
      strategies: [
        { name: "thick_description", korean: "두꺼운 기술", keywords: ["두꺼운 기술", "thick description", "상세 기술"] },
        { name: "purposeful_sampling", korean: "목적적 표본추출", keywords: ["목적적", "purposeful", "의도적 표집"] },
        { name: "context_description", korean: "맥락 기술", keywords: ["맥락", "context", "배경"] },
      ],
    },
    {
      criterion: "dependability",
      korean: "의존가능성 (Dependability)",
      strategies: [
        { name: "audit_trail", korean: "감사 추적", keywords: ["감사 추적", "audit trail", "연구 일지"] },
        { name: "code_recode", korean: "코드-재코드", keywords: ["재코드", "recode", "반복 코딩"] },
        { name: "peer_examination", korean: "동료 검증", keywords: ["동료 검증", "peer examination"] },
      ],
    },
    {
      criterion: "confirmability",
      korean: "확인가능성 (Confirmability)",
      strategies: [
        { name: "reflexivity", korean: "반성성", keywords: ["반성", "reflexiv", "성찰"] },
        { name: "audit_trail", korean: "감사 추적", keywords: ["감사 추적", "audit trail"] },
        { name: "triangulation", korean: "삼각화", keywords: ["삼각화", "triangulation"] },
      ],
    },
  ];

  return criteria.map((c) => {
    const applied: string[] = [];
    const missing: string[] = [];

    for (const strategy of c.strategies) {
      const found =
        strategy.keywords.some((k) => lowerDesc.includes(k)) ||
        lowerStrategies.some((s) => strategy.keywords.some((k) => s.includes(k)));

      if (found) {
        applied.push(strategy.korean);
      } else {
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
      recommendations: missing.map((m) => `${m} 전략을 추가로 적용하세요`),
    };
  });
}

function assessTracy(
  description: string,
  strategies: string[]
): CriterionAssessment[] {
  const lowerDesc = description.toLowerCase();

  const criteria = [
    {
      criterion: "worthy_topic",
      korean: "가치있는 주제",
      indicators: ["중요", "시의적절", "필요", "기여", "문제"],
    },
    {
      criterion: "rich_rigor",
      korean: "풍부한 엄격성",
      indicators: ["충분한", "다양한", "적절한", "체계적", "면밀한"],
    },
    {
      criterion: "sincerity",
      korean: "성실성",
      indicators: ["반성", "성찰", "한계", "투명", "정직"],
    },
    {
      criterion: "credibility",
      korean: "신빙성",
      indicators: ["삼각화", "참여자 확인", "두꺼운 기술", "구체적"],
    },
    {
      criterion: "resonance",
      korean: "공명",
      indicators: ["전이", "일반화", "독자", "영향", "감동"],
    },
    {
      criterion: "significant_contribution",
      korean: "의미있는 기여",
      indicators: ["기여", "확장", "새로운", "발전", "함의"],
    },
    {
      criterion: "ethics",
      korean: "윤리성",
      indicators: ["윤리", "동의", "익명", "보호", "IRB"],
    },
    {
      criterion: "meaningful_coherence",
      korean: "의미있는 일관성",
      indicators: ["일관", "연결", "목적", "방법론", "통합"],
    },
  ];

  return criteria.map((c) => {
    const matchCount = c.indicators.filter((i) => lowerDesc.includes(i)).length;
    const score = Math.round((matchCount / c.indicators.length) * 12.5);

    return {
      criterion: c.criterion,
      korean: c.korean,
      score,
      max_score: 12.5,
      strategies_applied: c.indicators.filter((i) => lowerDesc.includes(i)),
      missing_strategies: c.indicators.filter((i) => !lowerDesc.includes(i)),
      recommendations:
        score < 10
          ? [`${c.korean} 관련 내용을 보강하세요`]
          : [],
    };
  });
}

function getGrade(percentage: number): string {
  if (percentage >= 90) return "A (우수)";
  if (percentage >= 80) return "B (양호)";
  if (percentage >= 70) return "C (보통)";
  if (percentage >= 60) return "D (미흡)";
  return "F (개선 필요)";
}

function getPriorityActions(assessments: CriterionAssessment[]): string[] {
  return assessments
    .filter((a) => a.score / a.max_score < 0.5)
    .slice(0, 3)
    .map((a) => `${a.korean} 개선: ${a.recommendations[0] || "전략 추가 필요"}`);
}

function getQualityEnhancementGuide(): Record<string, string[]> {
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
