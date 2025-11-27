import { z } from "zod";
import { searchKnowledgeBase } from "../db/embeddings.js";

export const conceptualizeIdeaSchema = {
  type: "object",
  properties: {
    idea: {
      type: "string",
      description: "초기 아이디어",
    },
    phenomenon: {
      type: "string",
      description: "관련 현상",
    },
    existing_concepts: {
      type: "array",
      items: { type: "string" },
      description: "관련 기존 개념",
    },
  },
  required: ["idea"],
} as const;

const inputSchema = z.object({
  idea: z.string(),
  phenomenon: z.string().optional(),
  existing_concepts: z.array(z.string()).optional().default([]),
});

interface ConceptDevelopment {
  proposed_name: string;
  definition: string;
  core_attributes: string[];
  boundary_conditions: string[];
  differentiation: string;
  theoretical_position: string;
}

export async function conceptualizeIdea(args: Record<string, unknown>) {
  const { idea, phenomenon, existing_concepts } = inputSchema.parse(args);

  // Analyze the idea
  const ideaAnalysis = analyzeIdea(idea);

  // Develop concept
  const conceptDevelopment = developConcept(idea, phenomenon, existing_concepts);

  // Search for related concepts in knowledge base
  const relatedConcepts = await searchKnowledgeBase(
    `${idea} ${phenomenon || ""} 개념 이론`,
    "exemplars",
    3
  );

  // Generate naming options
  const namingOptions = generateNamingOptions(idea, ideaAnalysis);

  return {
    original_idea: idea,
    phenomenon: phenomenon || "명시되지 않음",
    existing_concepts_considered: existing_concepts,
    idea_analysis: {
      core_insight: ideaAnalysis.coreInsight,
      key_elements: ideaAnalysis.keyElements,
      potential_scope: ideaAnalysis.scope,
    },
    concept_development: {
      proposed_name: conceptDevelopment.proposed_name,
      alternative_names: namingOptions,
      definition: conceptDevelopment.definition,
      core_attributes: conceptDevelopment.core_attributes,
      boundary_conditions: conceptDevelopment.boundary_conditions,
    },
    differentiation_from_existing: {
      existing_concepts: existing_concepts,
      how_different: conceptDevelopment.differentiation,
      unique_contribution: getUniqueContribution(idea, existing_concepts),
    },
    theoretical_positioning: {
      suggested_position: conceptDevelopment.theoretical_position,
      related_theories: getRelatedTheories(idea),
      integration_possibilities: getIntegrationPossibilities(idea, existing_concepts),
    },
    related_literature: relatedConcepts.map((r) => ({
      content: r.content,
      relevance: "관련 개념 참조",
    })),
    next_steps: [
      "핵심 속성을 더 정교화하세요",
      "경험적 지표(indicators)를 개발하세요",
      "기존 문헌에서 유사 개념을 더 검토하세요",
      "조작적 정의를 개발하세요",
      "명제(proposition) 개발로 진행하세요",
    ],
    concept_paper_structure: getConceptPaperStructure(),
  };
}

interface IdeaAnalysis {
  coreInsight: string;
  keyElements: string[];
  scope: string;
}

function analyzeIdea(idea: string): IdeaAnalysis {
  const words = idea.split(/\s+/);
  const keyElements = words.filter((w) => w.length > 2).slice(0, 5);

  return {
    coreInsight: idea.slice(0, 100),
    keyElements,
    scope: idea.length > 200 ? "broad" : idea.length > 50 ? "moderate" : "narrow",
  };
}

function developConcept(
  idea: string,
  phenomenon: string | undefined,
  existingConcepts: string[]
): ConceptDevelopment {
  // Generate proposed concept name
  const proposedName = generateConceptName(idea);

  // Create definition
  const definition = generateDefinition(idea, phenomenon);

  // Identify core attributes
  const coreAttributes = identifyCoreAttributes(idea);

  // Define boundary conditions
  const boundaryConditions = defineBoundaryConditions(idea, phenomenon);

  // Differentiate from existing
  const differentiation = differentiateFromExisting(idea, existingConcepts);

  // Position theoretically
  const theoreticalPosition = positionTheoretically(idea);

  return {
    proposed_name: proposedName,
    definition,
    core_attributes: coreAttributes,
    boundary_conditions: boundaryConditions,
    differentiation,
    theoretical_position: theoreticalPosition,
  };
}

function generateConceptName(idea: string): string {
  const keywords = idea
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 2);

  if (keywords.length >= 2) {
    return `${keywords[0]} ${keywords[1]}`;
  }
  return `[개념명 제안 필요]`;
}

function generateNamingOptions(idea: string, analysis: IdeaAnalysis): string[] {
  const options: string[] = [];

  // Option 1: Compound term
  if (analysis.keyElements.length >= 2) {
    options.push(`${analysis.keyElements[0]}-${analysis.keyElements[1]}`);
  }

  // Option 2: -ing form (process)
  options.push(`[핵심동사]ing`);

  // Option 3: Metaphorical
  options.push(`[은유적 표현 고려]`);

  // Option 4: Descriptive
  options.push(`[현상 + 특성] 조합`);

  return options;
}

function generateDefinition(idea: string, phenomenon: string | undefined): string {
  const phenomenonText = phenomenon || "[관련 현상]";
  return `${phenomenonText}의 맥락에서, [행위자/주체]가 [조건/상황]에서 [핵심 활동/상태]를 통해 [결과/목적]을 달성하는 [과정/상태/특성]`;
}

function identifyCoreAttributes(idea: string): string[] {
  return [
    "속성 1: [핵심 특성 정의 필요]",
    "속성 2: [관계적 특성 정의 필요]",
    "속성 3: [과정적 특성 정의 필요]",
    "※ 각 속성의 차원(dimensions)을 정의하세요",
  ];
}

function defineBoundaryConditions(idea: string, phenomenon: string | undefined): string[] {
  return [
    "적용 가능: [이 개념이 적용되는 상황/맥락]",
    "적용 불가: [이 개념이 적용되지 않는 상황/맥락]",
    "수준: [개인/집단/조직/산업 수준]",
    "시간적 범위: [일시적/지속적/발전적]",
  ];
}

function differentiateFromExisting(idea: string, existingConcepts: string[]): string {
  if (existingConcepts.length === 0) {
    return "기존 개념이 명시되지 않음. 유사 개념 검토 후 차별화 포인트를 명확히 하세요.";
  }

  return `${existingConcepts.join(", ")}과(와) 구별되는 점: [차별화 포인트 명시 필요]`;
}

function positionTheoretically(idea: string): string {
  return "[관련 이론 틀] 내에서 [위치/역할]로 자리매김. 기존 [이론/개념]을 [확장/수정/통합]하는 기여.";
}

function getUniqueContribution(idea: string, existingConcepts: string[]): string[] {
  return [
    "이론적 기여: [기존 이론의 어떤 gap을 채우는가]",
    "현상적 기여: [어떤 현상을 새롭게 설명하는가]",
    "실무적 기여: [어떤 실무적 함의가 있는가]",
  ];
}

function getRelatedTheories(idea: string): string[] {
  return [
    "검토할 이론 1: [관련성 높은 이론]",
    "검토할 이론 2: [대안적 설명 제공 이론]",
    "검토할 이론 3: [보완적 이론]",
  ];
}

function getIntegrationPossibilities(idea: string, existingConcepts: string[]): string[] {
  return [
    "선행 요인으로서의 통합: 기존 개념의 원인 변수로 위치",
    "결과 요인으로서의 통합: 기존 개념의 결과 변수로 위치",
    "매개 요인으로서의 통합: 기존 개념들 간의 메커니즘으로 위치",
    "조절 요인으로서의 통합: 기존 관계의 경계조건으로 위치",
  ];
}

function getConceptPaperStructure(): Record<string, string[]> {
  return {
    introduction: [
      "현상 소개 및 연구 동기",
      "기존 이론/개념의 한계",
      "새 개념의 필요성",
      "논문의 기여",
    ],
    literature_review: [
      "관련 이론적 배경",
      "기존 개념들 검토",
      "통합 및 비판",
    ],
    concept_development: [
      "개념 정의",
      "핵심 속성과 차원",
      "경계 조건",
      "기존 개념과의 관계",
    ],
    theoretical_propositions: [
      "명제 1: 선행요인",
      "명제 2: 결과요인",
      "명제 3: 메커니즘",
    ],
    discussion: [
      "이론적 함의",
      "실무적 함의",
      "한계 및 향후 연구",
    ],
  };
}
