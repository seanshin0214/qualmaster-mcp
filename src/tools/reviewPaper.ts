import { z } from "zod";

export const reviewPaperSchema = {
  type: "object",
  properties: {
    paper_text: {
      type: "string",
      description: "논문 텍스트",
    },
    section: {
      type: "string",
      enum: ["introduction", "literature", "theory", "discussion", "full"],
      description: "평가 섹션",
    },
  },
  required: ["paper_text"],
} as const;

const inputSchema = z.object({
  paper_text: z.string(),
  section: z
    .enum(["introduction", "literature", "theory", "discussion", "full"])
    .optional()
    .default("full"),
});

interface SectionScore {
  section: string;
  korean: string;
  max_points: number;
  earned_points: number;
  criteria: Array<{
    criterion: string;
    max: number;
    earned: number;
    feedback: string;
  }>;
}

export async function reviewPaper(args: Record<string, unknown>) {
  const { paper_text, section } = inputSchema.parse(args);

  // Analyze paper by section
  const sectionScores: SectionScore[] = [];

  if (section === "full" || section === "introduction") {
    sectionScores.push(evaluateIntroduction(paper_text));
  }
  if (section === "full" || section === "literature") {
    sectionScores.push(evaluateLiterature(paper_text));
  }
  if (section === "full" || section === "theory") {
    sectionScores.push(evaluateTheory(paper_text));
  }
  if (section === "full" || section === "discussion") {
    sectionScores.push(evaluateDiscussion(paper_text));
  }

  // Add writing quality if full review
  if (section === "full") {
    sectionScores.push(evaluateWritingQuality(paper_text));
  }

  // Calculate total score
  const totalEarned = sectionScores.reduce((sum, s) => sum + s.earned_points, 0);
  const totalMax = sectionScores.reduce((sum, s) => sum + s.max_points, 0);
  const percentage = ((totalEarned / totalMax) * 100).toFixed(1);

  // Identify top issues
  const allCriteria = sectionScores.flatMap((s) =>
    s.criteria.map((c) => ({
      ...c,
      section: s.korean,
      gap: c.max - c.earned,
    }))
  );
  const topIssues = allCriteria.sort((a, b) => b.gap - a.gap).slice(0, 5);

  return {
    section_reviewed: section,
    paper_length: paper_text.length,
    overall_score: {
      earned: totalEarned,
      max: totalMax,
      percentage: `${percentage}%`,
      grade: getGrade(parseFloat(percentage)),
    },
    section_scores: sectionScores.map((s) => ({
      section: s.section,
      korean: s.korean,
      score: `${s.earned_points}/${s.max_points}`,
      percentage: `${((s.earned_points / s.max_points) * 100).toFixed(0)}%`,
      criteria_details: s.criteria,
    })),
    top_improvement_areas: topIssues.map((issue) => ({
      section: issue.section,
      criterion: issue.criterion,
      current_score: `${issue.earned}/${issue.max}`,
      feedback: issue.feedback,
    })),
    amr_checklist: getAMRChecklist(),
    revision_priorities: getRevisionPriorities(topIssues),
  };
}

function evaluateIntroduction(text: string): SectionScore {
  const section = extractSection(text, "introduction");
  const criteria = [
    {
      criterion: "Hook - 관심 유발",
      max: 5,
      check: (t: string) => t.length > 200 && (t.includes("최근") || t.includes("중요") || t.includes("문제")),
    },
    {
      criterion: "Gap - 문헌의 공백 식별",
      max: 5,
      check: (t: string) => t.includes("그러나") || t.includes("하지만") || t.includes("부족") || t.includes("gap"),
    },
    {
      criterion: "So What - 연구 중요성",
      max: 5,
      check: (t: string) => t.includes("필요") || t.includes("중요") || t.includes("기여"),
    },
    {
      criterion: "Contribution - 기여 명시",
      max: 5,
      check: (t: string) => t.includes("기여") || t.includes("contribution") || t.includes("확장"),
    },
  ];

  return {
    section: "introduction",
    korean: "서론",
    max_points: 20,
    earned_points: criteria.reduce((sum, c) => sum + (c.check(section) ? c.max : Math.floor(c.max * 0.3)), 0),
    criteria: criteria.map((c) => ({
      criterion: c.criterion,
      max: c.max,
      earned: c.check(section) ? c.max : Math.floor(c.max * 0.3),
      feedback: c.check(section) ? "적절히 포함됨" : "보강 필요",
    })),
  };
}

function evaluateLiterature(text: string): SectionScore {
  const section = extractSection(text, "literature");
  const criteria = [
    {
      criterion: "Integration - 문헌 통합",
      max: 7,
      check: (t: string) => t.includes("통합") || t.includes("종합") || t.includes("연결"),
    },
    {
      criterion: "Synthesis - 비판적 종합",
      max: 7,
      check: (t: string) => t.includes("반면") || t.includes("대조적") || t.includes("비판"),
    },
    {
      criterion: "Critical Analysis - 비판적 분석",
      max: 6,
      check: (t: string) => t.includes("한계") || t.includes("문제점") || t.includes("부족"),
    },
  ];

  return {
    section: "literature",
    korean: "문헌 검토",
    max_points: 20,
    earned_points: criteria.reduce((sum, c) => sum + (c.check(section) ? c.max : Math.floor(c.max * 0.3)), 0),
    criteria: criteria.map((c) => ({
      criterion: c.criterion,
      max: c.max,
      earned: c.check(section) ? c.max : Math.floor(c.max * 0.3),
      feedback: c.check(section) ? "적절히 포함됨" : "보강 필요",
    })),
  };
}

function evaluateTheory(text: string): SectionScore {
  const section = extractSection(text, "theory");
  const criteria = [
    {
      criterion: "Novelty - 새로움",
      max: 10,
      check: (t: string) => t.includes("새로운") || t.includes("novel") || t.includes("최초"),
    },
    {
      criterion: "Logic - 논리적 전개",
      max: 8,
      check: (t: string) => t.includes("따라서") || t.includes("그러므로") || t.includes("때문에"),
    },
    {
      criterion: "Mechanisms - 메커니즘 설명",
      max: 7,
      check: (t: string) => t.includes("메커니즘") || t.includes("mechanism") || t.includes("통해"),
    },
    {
      criterion: "Boundary Conditions - 경계조건",
      max: 5,
      check: (t: string) => t.includes("조건") || t.includes("경우") || t.includes("상황에서"),
    },
  ];

  return {
    section: "theory",
    korean: "이론 개발",
    max_points: 30,
    earned_points: criteria.reduce((sum, c) => sum + (c.check(section) ? c.max : Math.floor(c.max * 0.3)), 0),
    criteria: criteria.map((c) => ({
      criterion: c.criterion,
      max: c.max,
      earned: c.check(section) ? c.max : Math.floor(c.max * 0.3),
      feedback: c.check(section) ? "적절히 포함됨" : "보강 필요",
    })),
  };
}

function evaluateDiscussion(text: string): SectionScore {
  const section = extractSection(text, "discussion");
  const criteria = [
    {
      criterion: "Implications - 함의",
      max: 8,
      check: (t: string) => t.includes("함의") || t.includes("implication") || t.includes("시사점"),
    },
    {
      criterion: "Limitations - 한계",
      max: 6,
      check: (t: string) => t.includes("한계") || t.includes("limitation") || t.includes("제한"),
    },
    {
      criterion: "Future Research - 향후 연구",
      max: 6,
      check: (t: string) => t.includes("향후") || t.includes("future") || t.includes("추후"),
    },
  ];

  return {
    section: "discussion",
    korean: "논의",
    max_points: 20,
    earned_points: criteria.reduce((sum, c) => sum + (c.check(section) ? c.max : Math.floor(c.max * 0.3)), 0),
    criteria: criteria.map((c) => ({
      criterion: c.criterion,
      max: c.max,
      earned: c.check(section) ? c.max : Math.floor(c.max * 0.3),
      feedback: c.check(section) ? "적절히 포함됨" : "보강 필요",
    })),
  };
}

function evaluateWritingQuality(text: string): SectionScore {
  const criteria = [
    {
      criterion: "Clarity - 명확성",
      max: 4,
      check: (t: string) => t.length > 1000,
    },
    {
      criterion: "Flow - 논리적 흐름",
      max: 3,
      check: (t: string) => t.includes("첫째") || t.includes("둘째") || t.includes("마지막"),
    },
    {
      criterion: "Academic Conventions - 학술적 관례",
      max: 3,
      check: (t: string) => t.includes("연구") || t.includes("분석"),
    },
  ];

  return {
    section: "writing",
    korean: "글쓰기 품질",
    max_points: 10,
    earned_points: criteria.reduce((sum, c) => sum + (c.check(text) ? c.max : Math.floor(c.max * 0.3)), 0),
    criteria: criteria.map((c) => ({
      criterion: c.criterion,
      max: c.max,
      earned: c.check(text) ? c.max : Math.floor(c.max * 0.3),
      feedback: c.check(text) ? "적절함" : "개선 필요",
    })),
  };
}

function extractSection(text: string, section: string): string {
  // Simple extraction - in practice, would use more sophisticated parsing
  const lowerText = text.toLowerCase();

  const sectionKeywords: Record<string, string[]> = {
    introduction: ["서론", "introduction", "도입"],
    literature: ["문헌", "literature", "이론적 배경"],
    theory: ["이론", "theory", "개념", "명제"],
    discussion: ["논의", "discussion", "결론", "함의"],
  };

  const keywords = sectionKeywords[section] || [];

  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword);
    if (index !== -1) {
      return text.slice(index, index + 2000);
    }
  }

  return text;
}

function getGrade(percentage: number): string {
  if (percentage >= 90) return "A (출판 가능)";
  if (percentage >= 80) return "B (Minor Revision)";
  if (percentage >= 70) return "C (Major Revision)";
  if (percentage >= 60) return "D (Reject & Resubmit)";
  return "F (Reject)";
}

function getAMRChecklist(): Record<string, string> {
  return {
    "1_이론적_기여": "기존 이론을 확장, 수정, 또는 새로운 이론을 제안하는가?",
    "2_명확한_논리": "주장의 논리적 전개가 명확하고 설득력 있는가?",
    "3_경계조건": "이론의 적용 범위와 한계가 명시되어 있는가?",
    "4_실무적_함의": "실무자에게 유용한 통찰을 제공하는가?",
    "5_글쓰기_품질": "명확하고 간결하며 학술적 관례를 따르는가?",
  };
}

function getRevisionPriorities(
  issues: Array<{ section: string; criterion: string; gap: number; feedback: string }>
): string[] {
  return issues.slice(0, 3).map(
    (issue, i) => `${i + 1}. [${issue.section}] ${issue.criterion}: ${issue.feedback}`
  );
}
