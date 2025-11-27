import { z } from "zod";

export const diagnoseRejectionSchema = {
  type: "object",
  properties: {
    reviewer_comments: {
      type: "string",
      description: "리뷰어 코멘트",
    },
    editor_decision: {
      type: "string",
      description: "에디터 결정문",
    },
  },
  required: ["reviewer_comments"],
} as const;

const inputSchema = z.object({
  reviewer_comments: z.string(),
  editor_decision: z.string().optional(),
});

interface RejectionPattern {
  pattern: string;
  korean: string;
  confidence: number;
  indicators: string[];
  typical_phrases: string[];
}

const REJECTION_PATTERNS: RejectionPattern[] = [
  {
    pattern: "so_what",
    korean: '"So What?" - 기여도 불명확',
    confidence: 0,
    indicators: [
      "contribution is not clear",
      "기여가 불명확",
      "what does this add",
      "why should we care",
      "significance",
      "incremental",
      "기여도",
      "so what",
    ],
    typical_phrases: [
      "The contribution of this paper is unclear",
      "I fail to see the theoretical contribution",
      "What does this add to existing knowledge?",
    ],
  },
  {
    pattern: "old_wine",
    korean: '"Old Wine in New Bottle" - 신규성 부족',
    confidence: 0,
    indicators: [
      "not new",
      "already known",
      "existing",
      "well established",
      "기존",
      "이미",
      "새롭지 않",
      "novelty",
      "novel",
    ],
    typical_phrases: [
      "This has already been established",
      "The concept is not novel",
      "Similar ideas have been proposed before",
    ],
  },
  {
    pattern: "logic_gap",
    korean: '"Logic Gap" - 논리적 비약',
    confidence: 0,
    indicators: [
      "logical",
      "reasoning",
      "argument",
      "jump",
      "leap",
      "논리",
      "비약",
      "연결",
      "unclear how",
      "not follow",
    ],
    typical_phrases: [
      "The argument does not follow",
      "There is a logical gap between X and Y",
      "The reasoning is unclear",
    ],
  },
  {
    pattern: "boundary_problem",
    korean: '"Boundary Problem" - 경계조건 불명확',
    confidence: 0,
    indicators: [
      "boundary",
      "scope",
      "when",
      "conditions",
      "context",
      "경계",
      "범위",
      "조건",
      "언제",
      "어디서",
      "generalizability",
    ],
    typical_phrases: [
      "When does this apply?",
      "The boundary conditions are unclear",
      "Under what conditions?",
    ],
  },
  {
    pattern: "mechanism_missing",
    korean: '"Mechanism Missing" - 메커니즘 설명 부재',
    confidence: 0,
    indicators: [
      "mechanism",
      "how",
      "why",
      "process",
      "메커니즘",
      "어떻게",
      "왜",
      "과정",
      "설명",
      "black box",
    ],
    typical_phrases: [
      "How does this work?",
      "The mechanism is not explained",
      "Why would this relationship exist?",
    ],
  },
  {
    pattern: "literature_gap",
    korean: '"Literature Gap" - 문헌 검토 부족',
    confidence: 0,
    indicators: [
      "literature",
      "cite",
      "reference",
      "prior research",
      "문헌",
      "인용",
      "선행연구",
      "기존 연구",
      "ignore",
      "overlook",
    ],
    typical_phrases: [
      "The paper ignores relevant literature",
      "Key references are missing",
      "The literature review is incomplete",
    ],
  },
  {
    pattern: "method_mismatch",
    korean: '"Method Mismatch" - 방법론 불일치',
    confidence: 0,
    indicators: [
      "method",
      "approach",
      "design",
      "sample",
      "analysis",
      "방법",
      "연구설계",
      "표본",
      "분석",
      "inappropriate",
      "mismatch",
    ],
    typical_phrases: [
      "The method is inappropriate for the research question",
      "There is a mismatch between claims and evidence",
      "The analytical approach is problematic",
    ],
  },
  {
    pattern: "writing_quality",
    korean: '"Writing Quality" - 글쓰기 품질 문제',
    confidence: 0,
    indicators: [
      "writing",
      "clarity",
      "unclear",
      "confusing",
      "poorly written",
      "글쓰기",
      "명확",
      "혼란",
      "이해하기 어려",
      "organize",
    ],
    typical_phrases: [
      "The paper is poorly written",
      "The argument is confusing",
      "Needs significant editing",
    ],
  },
];

export async function diagnoseRejection(args: Record<string, unknown>) {
  const { reviewer_comments, editor_decision } = inputSchema.parse(args);

  const combinedText = `${reviewer_comments} ${editor_decision || ""}`.toLowerCase();

  // Calculate confidence for each pattern
  const patterns = REJECTION_PATTERNS.map((pattern) => {
    const matchedIndicators = pattern.indicators.filter((indicator) =>
      combinedText.includes(indicator.toLowerCase())
    );
    const confidence = Math.min(100, matchedIndicators.length * 20);

    return {
      ...pattern,
      confidence,
      matched_indicators: matchedIndicators,
    };
  });

  // Sort by confidence
  patterns.sort((a, b) => b.confidence - a.confidence);

  // Get primary patterns (confidence > 40)
  const primaryPatterns = patterns.filter((p) => p.confidence >= 40);
  const secondaryPatterns = patterns.filter((p) => p.confidence >= 20 && p.confidence < 40);

  // Extract key quotes
  const keyQuotes = extractKeyQuotes(reviewer_comments);

  // Determine overall severity
  const severity = calculateSeverity(primaryPatterns, editor_decision);

  return {
    input_summary: {
      reviewer_comments_length: reviewer_comments.length,
      has_editor_decision: !!editor_decision,
    },
    diagnosis: {
      primary_patterns: primaryPatterns.map((p) => ({
        pattern: p.pattern,
        korean: p.korean,
        confidence: `${p.confidence}%`,
        matched_indicators: p.matched_indicators,
        typical_phrases: p.typical_phrases,
      })),
      secondary_patterns: secondaryPatterns.map((p) => ({
        pattern: p.pattern,
        korean: p.korean,
        confidence: `${p.confidence}%`,
      })),
    },
    key_quotes: keyQuotes,
    severity: {
      level: severity.level,
      korean: severity.korean,
      recovery_difficulty: severity.recovery,
    },
    response_strategy: generateResponseStrategy(primaryPatterns),
    common_mistakes_to_avoid: getCommonMistakes(),
    next_steps: [
      "가장 높은 신뢰도의 패턴부터 대응하세요",
      "guide_revision 도구로 구체적 수정 전략을 확인하세요",
      "리뷰어 코멘트를 문장 단위로 분석하세요",
      "각 코멘트에 대한 구체적 대응 계획을 수립하세요",
    ],
  };
}

function extractKeyQuotes(comments: string): string[] {
  const sentences = comments.split(/[.!?]/).filter((s) => s.trim().length > 20);

  // Find sentences with critical keywords
  const criticalKeywords = [
    "concern",
    "problem",
    "issue",
    "unclear",
    "missing",
    "문제",
    "우려",
    "부족",
    "불명확",
    "recommend",
    "suggest",
    "권고",
  ];

  const criticalSentences = sentences.filter((s) =>
    criticalKeywords.some((k) => s.toLowerCase().includes(k))
  );

  return criticalSentences.slice(0, 5).map((s) => s.trim() + ".");
}

function calculateSeverity(
  patterns: RejectionPattern[],
  editorDecision: string | undefined
): { level: string; korean: string; recovery: string } {
  const avgConfidence =
    patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
      : 0;

  const hasRejectKeyword =
    editorDecision?.toLowerCase().includes("reject") ||
    editorDecision?.includes("리젝");

  if (hasRejectKeyword && avgConfidence > 60) {
    return {
      level: "severe",
      korean: "심각",
      recovery: "상당한 수정 필요, 다른 저널 고려 권장",
    };
  }

  if (avgConfidence > 50 || patterns.length >= 3) {
    return {
      level: "moderate",
      korean: "보통",
      recovery: "체계적 수정으로 회복 가능",
    };
  }

  return {
    level: "minor",
    korean: "경미",
    recovery: "minor revision 수준의 수정으로 충분",
  };
}

function generateResponseStrategy(patterns: RejectionPattern[]): Record<string, string[]> {
  const strategies: Record<string, string[]> = {};

  for (const pattern of patterns.slice(0, 3)) {
    strategies[pattern.korean] = getPatternStrategy(pattern.pattern);
  }

  return strategies;
}

function getPatternStrategy(pattern: string): string[] {
  const strategies: Record<string, string[]> = {
    so_what: [
      "서론에서 기여를 더 명확하고 구체적으로 제시",
      "'기존 연구 X를 Y 방향으로 확장한다' 형식 사용",
      "Discussion에서 이론적/실무적 함의 강화",
      "특정 독자에게 왜 중요한지 명시",
    ],
    old_wine: [
      "기존 개념과의 명확한 차별점 제시",
      "새로운 경계조건이나 맥락 강조",
      "다른 이론적 렌즈 적용 가능성 탐색",
      "기존 개념의 한계를 극복하는 방법 제시",
    ],
    logic_gap: [
      "논리 연결을 step-by-step으로 명시",
      "'왜냐하면' 구문 추가",
      "중간 논리를 더 상세히 전개",
      "도식이나 그림으로 논리 구조 시각화",
    ],
    boundary_problem: [
      "When/Where/Who 조건 명시",
      "적용 가능/불가 상황 구분",
      "일반화 범위 명확히 제한",
      "맥락 조건을 명제에 포함",
    ],
    mechanism_missing: [
      "인과 메커니즘 단계별 설명",
      "'How'와 'Why' 질문에 직접 답변",
      "중간 과정 상세 기술",
      "관련 이론을 활용한 메커니즘 정당화",
    ],
    literature_gap: [
      "누락된 핵심 문헌 추가",
      "최신 연구 반영",
      "관련 학문 분야 문헌 확대",
      "기존 연구와의 명확한 위치 설정",
    ],
    method_mismatch: [
      "방법론 선택 정당화 강화",
      "대안적 방법 고려 및 한계 인정",
      "연구질문-방법 적합성 명시",
      "방법론적 한계와 대응 전략 논의",
    ],
    writing_quality: [
      "전문 에디팅 서비스 활용",
      "논리 구조 재정리",
      "주요 논점 요약 제공",
      "동료 검토를 통한 명확성 점검",
    ],
  };

  return strategies[pattern] || ["구체적 대응 전략 개발 필요"];
}

function getCommonMistakes(): string[] {
  return [
    "리뷰어 의견에 방어적으로 대응하지 마세요",
    "모든 코멘트에 진지하게 답변하세요",
    "변경사항을 구체적으로 명시하세요",
    "동의하지 않을 때는 근거를 제시하며 정중하게 반박하세요",
    "수정본에서 변경 위치를 정확히 표시하세요",
  ];
}
