import { z } from "zod";

export const developPropositionSchema = {
  type: "object",
  properties: {
    concept: {
      type: "string",
      description: "핵심 개념",
    },
    relationships: {
      type: "array",
      items: { type: "string" },
      description: "관계 변수들",
    },
    mechanism: {
      type: "string",
      description: "제안 메커니즘",
    },
  },
  required: ["concept"],
} as const;

const inputSchema = z.object({
  concept: z.string(),
  relationships: z.array(z.string()).optional().default([]),
  mechanism: z.string().optional(),
});

interface Proposition {
  id: string;
  type: "antecedent" | "outcome" | "mechanism" | "moderator" | "mediator";
  statement: string;
  variables: string[];
  direction: string;
  conditions: string;
  testability: string;
}

export async function developProposition(args: Record<string, unknown>) {
  // Defensive coding
  if (!args || typeof args !== 'object' || !args.concept || typeof args.concept !== 'string' || args.concept.trim() === '') {
    return {
      error: true,
      message: "develop_proposition 도구에 필수 인자 'concept'이 전달되지 않았습니다.",
      required_parameters: { concept: "(필수) 핵심 개념" },
      example: { concept: "AI 의존성", relationships: ["의사결정 자신감", "리더 정체성"] }
    };
  }

  const { concept, relationships, mechanism } = inputSchema.parse(args);

  // Generate propositions
  const propositions = generatePropositions(concept, relationships, mechanism);

  // Create theoretical model
  const theoreticalModel = createTheoreticalModel(concept, propositions);

  return {
    focal_concept: concept,
    related_variables: relationships,
    proposed_mechanism: mechanism || "메커니즘 미명시",
    propositions: propositions.map((p) => ({
      id: p.id,
      type: p.type,
      type_korean: getPropositionTypeKorean(p.type),
      statement: p.statement,
      variables_involved: p.variables,
      direction: p.direction,
      boundary_conditions: p.conditions,
      testability: p.testability,
    })),
    theoretical_model: {
      structure: theoreticalModel.structure,
      visual_representation: theoreticalModel.visual,
      key_relationships: theoreticalModel.relationships,
    },
    proposition_quality_checklist: getPropositionChecklist(),
    writing_guidelines: {
      proposition_format: "When [조건], [독립변수] leads to [방향] [종속변수] because [메커니즘]",
      examples: getPropositionExamples(),
    },
    next_steps: [
      "각 명제의 경계조건을 더 구체화하세요",
      "명제 간 논리적 일관성을 점검하세요",
      "반증 가능한 형태로 진술하세요",
      "실증 테스트 가능성을 검토하세요",
      "논문의 Discussion에서 함의를 도출하세요",
    ],
  };
}

function generatePropositions(
  concept: string,
  relationships: string[],
  mechanism: string | undefined
): Proposition[] {
  const propositions: Proposition[] = [];

  // P1: Antecedent proposition
  propositions.push({
    id: "P1",
    type: "antecedent",
    statement: `[선행요인]이 높을수록, ${concept}이(가) 증가한다.`,
    variables: ["[선행요인]", concept],
    direction: "정(+)의 관계",
    conditions: "[특정 맥락/조건]에서",
    testability: "설문/실험으로 검증 가능",
  });

  // P2: Outcome proposition
  propositions.push({
    id: "P2",
    type: "outcome",
    statement: `${concept}이(가) 높을수록, [결과변수]가 향상된다.`,
    variables: [concept, "[결과변수]"],
    direction: "정(+)의 관계",
    conditions: "[특정 맥락/조건]에서",
    testability: "종단 연구로 검증 가능",
  });

  // Add mechanism proposition if provided
  if (mechanism) {
    propositions.push({
      id: "P3",
      type: "mechanism",
      statement: `${concept}은(는) ${mechanism}을(를) 통해 [결과변수]에 영향을 미친다.`,
      variables: [concept, mechanism, "[결과변수]"],
      direction: "매개 관계",
      conditions: "[특정 맥락/조건]에서",
      testability: "매개분석으로 검증 가능",
    });
  }

  // Add relationship-based propositions
  relationships.forEach((rel, index) => {
    propositions.push({
      id: `P${propositions.length + 1}`,
      type: index % 2 === 0 ? "moderator" : "mediator",
      statement:
        index % 2 === 0
          ? `${rel}이(가) 높을수록, ${concept}과(와) [결과변수] 간의 관계가 강화된다.`
          : `${concept}은(는) ${rel}을(를) 통해 [결과변수]에 영향을 미친다.`,
      variables: [concept, rel, "[결과변수]"],
      direction: index % 2 === 0 ? "조절 관계" : "매개 관계",
      conditions: "[특정 맥락/조건]에서",
      testability: index % 2 === 0 ? "조절분석으로 검증 가능" : "매개분석으로 검증 가능",
    });
  });

  return propositions;
}

function getPropositionTypeKorean(type: string): string {
  const typeMap: Record<string, string> = {
    antecedent: "선행요인 명제",
    outcome: "결과요인 명제",
    mechanism: "메커니즘 명제",
    moderator: "조절효과 명제",
    mediator: "매개효과 명제",
  };
  return typeMap[type] || type;
}

interface TheoreticalModel {
  structure: string;
  visual: string;
  relationships: string[];
}

function createTheoreticalModel(
  concept: string,
  propositions: Proposition[]
): TheoreticalModel {
  const antecedents = propositions.filter((p) => p.type === "antecedent");
  const outcomes = propositions.filter((p) => p.type === "outcome");
  const mechanisms = propositions.filter((p) => p.type === "mechanism" || p.type === "mediator");
  const moderators = propositions.filter((p) => p.type === "moderator");

  const visual = `
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  선행요인   │ ──→ │  ${concept.slice(0, 8).padEnd(8)}  │ ──→ │  결과변수   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  메커니즘   │
                    └─────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   [조절변수1]        [조절변수2]        [조절변수3]
`;

  return {
    structure: `선행요인 → ${concept} → 결과변수 (메커니즘/조절변수 포함)`,
    visual: visual.trim(),
    relationships: [
      `선행요인 → ${concept}: ${antecedents.length}개 명제`,
      `${concept} → 결과변수: ${outcomes.length}개 명제`,
      `매개/메커니즘: ${mechanisms.length}개 명제`,
      `조절효과: ${moderators.length}개 명제`,
    ],
  };
}

function getPropositionChecklist(): Record<string, string> {
  return {
    "1_명확성": "명제가 명확하고 이해 가능한가?",
    "2_방향성": "변수 간 관계의 방향이 명시되어 있는가?",
    "3_조건성": "경계조건(boundary conditions)이 명시되어 있는가?",
    "4_반증가능성": "반증할 수 있는 형태로 진술되어 있는가?",
    "5_논리적일관성": "다른 명제들과 논리적으로 일관되는가?",
    "6_이론적근거": "명제를 뒷받침하는 이론적 논거가 있는가?",
    "7_경험적기반": "기존 연구 증거가 명제를 지지하는가?",
    "8_검증가능성": "실증적으로 테스트할 수 있는가?",
  };
}

function getPropositionExamples(): string[] {
  return [
    "Proposition 1: Psychological safety is positively related to team learning behaviors, particularly when task interdependence is high.",
    "Proposition 2: Leader humility influences team psychological safety through role modeling of fallibility acknowledgment.",
    "Proposition 3: The relationship between X and Y is stronger when Z is present, because Z creates conditions that amplify the effect of X.",
    "명제 예시: 조직의 학습지향성이 높을수록, 구성원의 창의적 행동이 증가하며, 이 관계는 심리적 안전감이 높을 때 더욱 강화된다.",
  ];
}
