import { z } from "zod";
import { searchKnowledgeBase } from "../db/embeddings.js";

export const suggestMethodologySchema = {
  type: "object",
  properties: {
    research_question: {
      type: "string",
      description: "연구 질문",
    },
    purpose: {
      type: "string",
      enum: ["explore", "describe", "explain", "evaluate"],
      description: "연구 목적",
    },
    participants: {
      type: "string",
      description: "참여자 특성",
    },
    data_type: {
      type: "string",
      description: "데이터 유형",
    },
  },
  required: ["research_question"],
} as const;

const inputSchema = z.object({
  research_question: z.string(),
  purpose: z.enum(["explore", "describe", "explain", "evaluate"]).optional(),
  participants: z.string().optional(),
  data_type: z.string().optional(),
});

interface MethodologyScore {
  methodology: string;
  korean: string;
  score: number;
  reasons: string[];
  considerations: string[];
}

export async function suggestMethodology(args: Record<string, unknown>) {
  const { research_question, purpose, participants, data_type } = inputSchema.parse(args);

  // Analyze research question keywords
  const questionAnalysis = analyzeResearchQuestion(research_question);

  // Calculate methodology fit scores
  const scores: MethodologyScore[] = [
    calculatePhenomenologyFit(questionAnalysis, purpose, participants),
    calculateGroundedTheoryFit(questionAnalysis, purpose, participants),
    calculateEthnographyFit(questionAnalysis, purpose, participants),
    calculateNarrativeFit(questionAnalysis, purpose, participants),
    calculateCaseStudyFit(questionAnalysis, purpose, participants),
  ];

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  // Get additional context from knowledge base
  const contextInfo = await searchKnowledgeBase(
    `${research_question} 질적연구 방법론`,
    "traditions",
    2
  );

  return {
    research_question,
    purpose: purpose || "not specified",
    question_analysis: questionAnalysis,
    recommendations: scores.map((s, i) => ({
      rank: i + 1,
      methodology: s.methodology,
      korean_name: s.korean,
      fit_score: `${s.score}/100`,
      reasons: s.reasons,
      considerations: s.considerations,
    })),
    top_recommendation: {
      methodology: scores[0].methodology,
      why: scores[0].reasons,
      next_steps: getNextSteps(scores[0].methodology),
    },
    alternative_considerations: contextInfo.map((c) => c.content).slice(0, 2),
  };
}

interface QuestionAnalysis {
  keywords: string[];
  questionType: string;
  focusArea: string;
  hasProcessFocus: boolean;
  hasExperienceFocus: boolean;
  hasCultureFocus: boolean;
  hasStoryFocus: boolean;
  hasContextFocus: boolean;
}

function analyzeResearchQuestion(question: string): QuestionAnalysis {
  const lowerQuestion = question.toLowerCase();

  // Korean keywords
  const experienceKeywords = ["경험", "느낌", "인식", "의미", "이해", "살아온"];
  const processKeywords = ["과정", "어떻게", "변화", "발전", "단계", "진행"];
  const cultureKeywords = ["문화", "집단", "조직", "공동체", "관행", "규범"];
  const storyKeywords = ["이야기", "생애", "삶", "역사", "전환", "궤적"];
  const contextKeywords = ["사례", "맥락", "상황", "왜", "어떻게"];

  return {
    keywords: extractKeywords(question),
    questionType: determineQuestionType(lowerQuestion),
    focusArea: determineFocusArea(lowerQuestion),
    hasProcessFocus: processKeywords.some((k) => lowerQuestion.includes(k)),
    hasExperienceFocus: experienceKeywords.some((k) => lowerQuestion.includes(k)),
    hasCultureFocus: cultureKeywords.some((k) => lowerQuestion.includes(k)),
    hasStoryFocus: storyKeywords.some((k) => lowerQuestion.includes(k)),
    hasContextFocus: contextKeywords.some((k) => lowerQuestion.includes(k)),
  };
}

function extractKeywords(text: string): string[] {
  const words = text.split(/\s+/);
  return words.filter((w) => w.length > 1);
}

function determineQuestionType(question: string): string {
  if (question.includes("무엇") || question.includes("어떤")) return "what";
  if (question.includes("어떻게")) return "how";
  if (question.includes("왜")) return "why";
  if (question.includes("경험")) return "experience";
  return "descriptive";
}

function determineFocusArea(question: string): string {
  if (question.includes("경험") || question.includes("느낌")) return "experience";
  if (question.includes("과정") || question.includes("변화")) return "process";
  if (question.includes("문화") || question.includes("조직")) return "culture";
  if (question.includes("이야기") || question.includes("삶")) return "story";
  if (question.includes("사례")) return "case";
  return "general";
}

function calculatePhenomenologyFit(
  analysis: QuestionAnalysis,
  purpose?: string,
  participants?: string
): MethodologyScore {
  let score = 50;
  const reasons: string[] = [];
  const considerations: string[] = [];

  if (analysis.hasExperienceFocus) {
    score += 30;
    reasons.push("연구 질문이 '경험'에 초점을 맞추고 있음");
  }
  if (analysis.questionType === "experience" || analysis.questionType === "what") {
    score += 15;
    reasons.push("경험의 본질을 탐구하는 질문 유형");
  }
  if (purpose === "explore" || purpose === "describe") {
    score += 10;
    reasons.push("탐색/기술 목적에 적합");
  }
  if (participants && participants.includes("개인")) {
    score += 5;
    reasons.push("개인 수준 분석에 적합");
  }

  if (analysis.hasProcessFocus) {
    score -= 10;
    considerations.push("과정 초점 연구에는 근거이론이 더 적합할 수 있음");
  }
  if (analysis.hasCultureFocus) {
    score -= 15;
    considerations.push("문화적 초점 연구에는 문화기술지가 더 적합");
  }

  return {
    methodology: "phenomenology",
    korean: "현상학",
    score: Math.min(100, Math.max(0, score)),
    reasons: reasons.length > 0 ? reasons : ["일반적인 경험 연구에 활용 가능"],
    considerations,
  };
}

function calculateGroundedTheoryFit(
  analysis: QuestionAnalysis,
  purpose?: string,
  participants?: string
): MethodologyScore {
  let score = 50;
  const reasons: string[] = [];
  const considerations: string[] = [];

  if (analysis.hasProcessFocus) {
    score += 30;
    reasons.push("'과정' 또는 '변화'에 초점을 맞춘 질문");
  }
  if (analysis.questionType === "how") {
    score += 20;
    reasons.push("'어떻게' 질문에 적합");
  }
  if (purpose === "explain") {
    score += 15;
    reasons.push("설명적 이론 개발 목적에 적합");
  }

  if (analysis.hasExperienceFocus && !analysis.hasProcessFocus) {
    score -= 10;
    considerations.push("순수 경험 탐구에는 현상학이 더 적합할 수 있음");
  }

  return {
    methodology: "grounded_theory",
    korean: "근거이론",
    score: Math.min(100, Math.max(0, score)),
    reasons: reasons.length > 0 ? reasons : ["이론 개발이 필요한 연구에 활용"],
    considerations,
  };
}

function calculateEthnographyFit(
  analysis: QuestionAnalysis,
  purpose?: string,
  participants?: string
): MethodologyScore {
  let score = 50;
  const reasons: string[] = [];
  const considerations: string[] = [];

  if (analysis.hasCultureFocus) {
    score += 35;
    reasons.push("문화/집단에 초점을 맞춘 연구 질문");
  }
  if (participants && (participants.includes("집단") || participants.includes("조직"))) {
    score += 15;
    reasons.push("문화공유집단 연구에 적합");
  }
  if (purpose === "describe") {
    score += 10;
    reasons.push("문화적 패턴 기술 목적에 적합");
  }

  considerations.push("장기 현장연구가 필요함을 고려해야 함");

  return {
    methodology: "ethnography",
    korean: "문화기술지",
    score: Math.min(100, Math.max(0, score)),
    reasons: reasons.length > 0 ? reasons : ["문화/조직 연구에 활용"],
    considerations,
  };
}

function calculateNarrativeFit(
  analysis: QuestionAnalysis,
  purpose?: string,
  participants?: string
): MethodologyScore {
  let score = 50;
  const reasons: string[] = [];
  const considerations: string[] = [];

  if (analysis.hasStoryFocus) {
    score += 35;
    reasons.push("삶의 이야기/생애사에 초점");
  }
  if (analysis.focusArea === "story") {
    score += 15;
    reasons.push("내러티브 구조 분석에 적합");
  }

  if (participants && participants.includes("다수")) {
    score -= 10;
    considerations.push("다수 참여자 연구에는 다른 방법론 고려");
  }

  return {
    methodology: "narrative",
    korean: "내러티브 연구",
    score: Math.min(100, Math.max(0, score)),
    reasons: reasons.length > 0 ? reasons : ["개인 생애 경험 연구에 활용"],
    considerations,
  };
}

function calculateCaseStudyFit(
  analysis: QuestionAnalysis,
  purpose?: string,
  participants?: string
): MethodologyScore {
  let score = 50;
  const reasons: string[] = [];
  const considerations: string[] = [];

  if (analysis.hasContextFocus) {
    score += 25;
    reasons.push("맥락 내 현상 이해에 적합");
  }
  if (analysis.questionType === "how" || analysis.questionType === "why") {
    score += 20;
    reasons.push("'어떻게/왜' 질문에 적합");
  }
  if (purpose === "explain" || purpose === "evaluate") {
    score += 15;
    reasons.push("설명/평가 목적에 적합");
  }

  return {
    methodology: "case_study",
    korean: "사례연구",
    score: Math.min(100, Math.max(0, score)),
    reasons: reasons.length > 0 ? reasons : ["복잡한 현상의 맥락적 이해에 활용"],
    considerations,
  };
}

function getNextSteps(methodology: string): string[] {
  const steps: Record<string, string[]> = {
    phenomenology: [
      "연구 현상을 명확히 정의하기",
      "에포케(판단중지) 연습하기",
      "심층면담 가이드 개발하기",
      "현상학적 분석 절차 숙지하기",
    ],
    grounded_theory: [
      "초기 표본 선정하기",
      "개방코딩 연습하기",
      "메모 작성 습관 만들기",
      "이론적 표본추출 계획하기",
    ],
    ethnography: [
      "현장 접근 계획하기",
      "현장노트 양식 준비하기",
      "주요 정보제공자 확보하기",
      "장기 연구 일정 수립하기",
    ],
    narrative: [
      "생애사 면담 가이드 개발하기",
      "시간순서 정리 방법 계획하기",
      "이야기 분석 틀 선정하기",
      "참여자 관계 형성 계획하기",
    ],
    case_study: [
      "사례 경계 명확히 하기",
      "다중 자료원 계획하기",
      "사례 선정 기준 정하기",
      "분석 단위 결정하기",
    ],
  };

  return steps[methodology] || ["연구 설계 세부 계획 수립하기"];
}
