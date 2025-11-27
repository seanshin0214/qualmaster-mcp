/**
 * Tool Testing Script for Dr. QualMaster MCP Server
 *
 * Usage: npm test
 *
 * This script tests all 12 MCP tools with sample inputs
 * and validates the expected outputs.
 */

import { initializeDatabase } from "../src/db/client.js";
import { searchKnowledge } from "../src/tools/searchKnowledge.js";
import { getMethodology } from "../src/tools/getMethodology.js";
import { suggestMethodology } from "../src/tools/suggestMethodology.js";
import { autoCoding } from "../src/tools/autoCoding.js";
import { extractThemes } from "../src/tools/extractThemes.js";
import { detectSaturation } from "../src/tools/detectSaturation.js";
import { assessQuality } from "../src/tools/assessQuality.js";
import { conceptualizeIdea } from "../src/tools/conceptualizeIdea.js";
import { developProposition } from "../src/tools/developProposition.js";
import { reviewPaper } from "../src/tools/reviewPaper.js";
import { diagnoseRejection } from "../src/tools/diagnoseRejection.js";
import { guideRevision } from "../src/tools/guideRevision.js";
import dotenv from "dotenv";

dotenv.config();

interface TestCase {
  name: string;
  tool: string;
  input: Record<string, unknown>;
  validate: (result: unknown) => boolean;
  description: string;
}

// Test cases for all 12 tools
const testCases: TestCase[] = [
  // 1. search_knowledge
  {
    name: "search_knowledge - 현상학 에포케",
    tool: "search_knowledge",
    input: { query: "현상학 에포케", category: "traditions", n_results: 3 },
    validate: (result) => {
      const r = result as { results: Array<{ content: string }> };
      return r.results && r.results.length > 0;
    },
    description: "현상학 관련 지식베이스 검색",
  },
  {
    name: "search_knowledge - 근거이론 코딩",
    tool: "search_knowledge",
    input: { query: "근거이론 개방코딩 축코딩", category: "traditions" },
    validate: (result) => {
      const r = result as { results: Array<{ content: string }> };
      return r.results && r.results.length > 0;
    },
    description: "근거이론 코딩 절차 검색",
  },

  // 2. get_methodology
  {
    name: "get_methodology - 현상학",
    tool: "get_methodology",
    input: { methodology: "phenomenology", variant: "IPA" },
    validate: (result) => {
      const r = result as { methodology: string };
      return r.methodology && r.methodology.length > 0;
    },
    description: "IPA 방법론 상세 정보 조회",
  },
  {
    name: "get_methodology - 근거이론",
    tool: "get_methodology",
    input: { methodology: "grounded_theory", variant: "Charmaz" },
    validate: (result) => {
      const r = result as { methodology: string };
      return r.methodology && r.methodology.length > 0;
    },
    description: "Charmaz 근거이론 조회",
  },

  // 3. suggest_methodology
  {
    name: "suggest_methodology - 경험 탐색",
    tool: "suggest_methodology",
    input: {
      research_question: "간호사의 소진 경험은 어떠한가?",
      purpose: "explore",
      participants: "중환자실 간호사 10명",
    },
    validate: (result) => {
      const r = result as { recommendation: { methodology: string } };
      return r.recommendation && r.recommendation.methodology.includes("phenomenology");
    },
    description: "소진 경험 연구에 현상학 추천 기대",
  },
  {
    name: "suggest_methodology - 이론 개발",
    tool: "suggest_methodology",
    input: {
      research_question: "신입 교사의 정체성 형성 과정은 어떠한가?",
      purpose: "explain",
      data_type: "심층면담, 관찰",
    },
    validate: (result) => {
      const r = result as { recommendation: { methodology: string } };
      return r.recommendation && r.recommendation.methodology.includes("grounded");
    },
    description: "과정 연구에 근거이론 추천 기대",
  },

  // 4. auto_coding
  {
    name: "auto_coding - 면담 텍스트",
    tool: "auto_coding",
    input: {
      text: `처음 진단받았을 때 정말 무서웠어요. 앞으로 어떻게 될지 전혀 모르겠더라고요.
             그런데 시간이 지나면서 조금씩 받아들이게 됐어요. 다른 환자분들 만나면서
             혼자가 아니라는 걸 알게 됐거든요.`,
      methodology: "phenomenology",
      existing_codes: [],
    },
    validate: (result) => {
      const r = result as { codes: string[] };
      return r.codes && r.codes.length > 0;
    },
    description: "면담 텍스트 자동 코딩",
  },

  // 5. extract_themes
  {
    name: "extract_themes - 코드에서 주제 추출",
    tool: "extract_themes",
    input: {
      codes: [
        "초기 충격", "불확실성", "두려움", "시간의 흐름",
        "수용", "동료 환자와의 연대", "의미 재구성", "성장"
      ],
      mode: "inductive",
    },
    validate: (result) => {
      const r = result as { themes: Array<{ name: string }> };
      return r.themes && r.themes.length > 0;
    },
    description: "귀납적 주제 추출",
  },

  // 6. detect_saturation
  {
    name: "detect_saturation - 포화도 평가",
    tool: "detect_saturation",
    input: {
      codes: [
        "초기 충격", "불확실성", "두려움", "수용", "성장",
        "초기 충격", "불확실성", "두려움", "수용", "성장",
        "초기 충격", "불확실성", "두려움", "수용", "성장",
      ],
      new_codes_by_source: {
        participant_1: ["초기 충격", "불확실성", "두려움", "수용", "성장"],
        participant_2: ["초기 충격", "불확실성", "두려움"],
        participant_3: ["수용", "성장"],
        participant_4: [],
        participant_5: [],
      },
      level: "code",
    },
    validate: (result) => {
      const r = result as { saturation: { level: string; percentage: number } };
      return r.saturation && r.saturation.percentage >= 0;
    },
    description: "코드 수준 포화도 평가",
  },

  // 7. assess_quality
  {
    name: "assess_quality - Lincoln & Guba 평가",
    tool: "assess_quality",
    input: {
      research_description: "본 연구는 암 환자의 투병 경험을 탐색하기 위해 IPA를 사용했습니다. 10명의 참여자와 반구조화 면담을 수행했으며, 참여자 확인과 동료 검토를 통해 신빙성을 확보했습니다.",
      strategies_used: ["member_checking", "peer_debriefing", "thick_description"],
      criteria: "lincoln_guba",
    },
    validate: (result) => {
      const r = result as { assessment: { credibility: number } };
      return r.assessment && r.assessment.credibility >= 0;
    },
    description: "Lincoln & Guba 기준 품질 평가",
  },

  // 8. conceptualize_idea
  {
    name: "conceptualize_idea - 아이디어 개념화",
    tool: "conceptualize_idea",
    input: {
      idea: "조직에서 새로운 아이디어가 무시당하면 직원들이 더 이상 제안하지 않게 된다",
      phenomenon: "조직 침묵",
      existing_concepts: ["psychological safety", "voice behavior", "learned helplessness"],
    },
    validate: (result) => {
      const r = result as { concept: { name: string; definition: string } };
      return r.concept && r.concept.name && r.concept.definition;
    },
    description: "초기 아이디어를 학술 개념으로 발전",
  },

  // 9. develop_proposition
  {
    name: "develop_proposition - 명제 개발",
    tool: "develop_proposition",
    input: {
      concept: "아이디어 무력감 (Idea Helplessness)",
      relationships: ["심리적 안전감", "혁신 행동", "조직 문화"],
      mechanism: "반복적인 아이디어 거부 경험이 학습된 무력감을 유발",
    },
    validate: (result) => {
      const r = result as { propositions: Array<{ statement: string }> };
      return r.propositions && r.propositions.length > 0;
    },
    description: "이론적 명제 개발",
  },

  // 10. review_paper
  {
    name: "review_paper - 컨셉 논문 리뷰",
    tool: "review_paper",
    input: {
      paper_text: `
        Introduction
        Organizations increasingly depend on employee ideas for innovation.
        However, many good ideas are never implemented. This paper introduces
        the concept of "Idea Helplessness" to explain why employees stop
        sharing ideas even when they have potentially valuable contributions.

        We build on learned helplessness theory and psychological safety
        literature to develop a theoretical framework explaining how
        repeated rejection of ideas leads to a state of idea helplessness.
      `,
      section: "introduction",
    },
    validate: (result) => {
      const r = result as { review: { score: number; feedback: string[] } };
      return r.review && typeof r.review.score === "number";
    },
    description: "Introduction 섹션 리뷰",
  },

  // 11. diagnose_rejection
  {
    name: "diagnose_rejection - So What 패턴",
    tool: "diagnose_rejection",
    input: {
      reviewer_comments: `
        The contribution of this paper is unclear. What does this add to
        what we already know? The concept seems to overlap significantly
        with existing constructs like learned helplessness and psychological
        safety. The paper does not make a compelling case for why we need
        a new concept.
      `,
      editor_decision: "Reject - insufficient theoretical contribution",
    },
    validate: (result) => {
      const r = result as { diagnosis: { pattern: string } };
      return r.diagnosis && r.diagnosis.pattern === "so_what";
    },
    description: "'So What?' 리젝션 패턴 진단",
  },
  {
    name: "diagnose_rejection - Logic Gap 패턴",
    tool: "diagnose_rejection",
    input: {
      reviewer_comments: `
        The theoretical logic is flawed. The connection between idea rejection
        and helplessness is not adequately justified. Why would rejection in
        one domain (ideas) generalize to helplessness? The mechanism is
        underspecified.
      `,
    },
    validate: (result) => {
      const r = result as { diagnosis: { pattern: string } };
      return r.diagnosis && r.diagnosis.pattern === "logic_gap";
    },
    description: "'Logic Gap' 리젝션 패턴 진단",
  },

  // 12. guide_revision
  {
    name: "guide_revision - So What 대응",
    tool: "guide_revision",
    input: {
      rejection_pattern: "so_what",
      original_content: "This paper introduces the concept of Idea Helplessness.",
      reviewer_comment: "The contribution is not clear. What does this add?",
    },
    validate: (result) => {
      const r = result as { revision: { strategy: string; suggested_text: string } };
      return r.revision && r.revision.strategy && r.revision.suggested_text;
    },
    description: "'So What?' 대응 전략 제안",
  },
];

// Tool function mapping
const toolFunctions: Record<string, (input: Record<string, unknown>) => Promise<unknown>> = {
  search_knowledge: searchKnowledge,
  get_methodology: getMethodology,
  suggest_methodology: suggestMethodology,
  auto_coding: autoCoding,
  extract_themes: extractThemes,
  detect_saturation: detectSaturation,
  assess_quality: assessQuality,
  conceptualize_idea: conceptualizeIdea,
  develop_proposition: developProposition,
  review_paper: reviewPaper,
  diagnose_rejection: diagnoseRejection,
  guide_revision: guideRevision,
};

/**
 * Run all tests
 */
async function runTests() {
  console.log("🧪 Dr. QualMaster MCP Server - Tool Test Suite\n");
  console.log("=".repeat(60) + "\n");

  // Initialize database
  console.log("📦 Initializing database...");
  try {
    await initializeDatabase();
    console.log("   ✅ Database initialized\n");
  } catch (error) {
    console.log("   ⚠️  Database initialization skipped (may not exist yet)\n");
  }

  let passed = 0;
  let failed = 0;
  const results: Array<{ name: string; status: string; error?: string }> = [];

  for (const testCase of testCases) {
    process.stdout.write(`🔄 Testing: ${testCase.name}...`);

    try {
      const toolFn = toolFunctions[testCase.tool];
      if (!toolFn) {
        throw new Error(`Tool function not found: ${testCase.tool}`);
      }

      const result = await toolFn(testCase.input);

      if (testCase.validate(result)) {
        console.log(" ✅ PASSED");
        passed++;
        results.push({ name: testCase.name, status: "PASSED" });
      } else {
        console.log(" ❌ FAILED (validation)");
        failed++;
        results.push({
          name: testCase.name,
          status: "FAILED",
          error: "Validation failed"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(` ❌ FAILED (${errorMessage})`);
      failed++;
      results.push({
        name: testCase.name,
        status: "FAILED",
        error: errorMessage
      });
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Summary\n");
  console.log(`   Total:  ${testCases.length}`);
  console.log(`   Passed: ${passed} ✅`);
  console.log(`   Failed: ${failed} ❌`);
  console.log(`   Rate:   ${((passed / testCases.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log("\n❌ Failed Tests:");
    for (const result of results.filter(r => r.status === "FAILED")) {
      console.log(`   - ${result.name}: ${result.error}`);
    }
  }

  console.log("\n" + "=".repeat(60));

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run
runTests().catch(console.error);
