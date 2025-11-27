import { z } from "zod";
import { searchKnowledgeBase } from "../db/embeddings.js";

export const getMethodologySchema = {
  type: "object",
  properties: {
    methodology: {
      type: "string",
      enum: ["phenomenology", "grounded_theory", "ethnography", "narrative", "case_study"],
      description: "방법론 ID",
    },
    variant: {
      type: "string",
      description: "세부 변형 (예: IPA, Charmaz, Yin)",
    },
  },
  required: ["methodology"],
} as const;

const inputSchema = z.object({
  methodology: z.enum([
    "phenomenology",
    "grounded_theory",
    "ethnography",
    "narrative",
    "case_study",
  ]),
  variant: z.string().optional(),
});

// 방법론별 기본 정보
const METHODOLOGY_INFO: Record<
  string,
  {
    korean: string;
    description: string;
    variants: string[];
    keyFeatures: string[];
    bestFor: string[];
  }
> = {
  phenomenology: {
    korean: "현상학",
    description: "개인이 특정 현상을 어떻게 경험하는지 이해하고자 하는 연구 접근",
    variants: ["Husserlian (기술적)", "Heideggerian (해석적)", "IPA", "Van Manen"],
    keyFeatures: [
      "에포케(Epoché) - 판단중지",
      "본질(Essence) 추구",
      "지향성(Intentionality)",
      "생활세계(Lifeworld) 탐구",
    ],
    bestFor: [
      "경험의 본질 탐구",
      "의미 이해",
      "심층적 개인 경험 연구",
      "새로운 현상의 초기 탐색",
    ],
  },
  grounded_theory: {
    korean: "근거이론",
    description: "데이터로부터 이론을 체계적으로 생성하는 연구 접근",
    variants: ["Glaserian (Classic)", "Straussian", "Charmaz (Constructivist)"],
    keyFeatures: [
      "지속적 비교분석",
      "이론적 표본추출",
      "이론적 포화",
      "메모 작성",
      "개방/축/선택 코딩",
    ],
    bestFor: [
      "과정 이론 개발",
      "새로운 이론 생성",
      "행동/상호작용 패턴 이해",
      "기존 이론이 부족한 영역",
    ],
  },
  ethnography: {
    korean: "문화기술지",
    description: "문화집단의 공유된 패턴을 기술하고 해석하는 연구 접근",
    variants: ["Classical", "Critical", "Autoethnography", "Digital/Virtual"],
    keyFeatures: [
      "장기 현장연구",
      "참여관찰",
      "문화적 맥락 중시",
      "두꺼운 기술(Thick Description)",
    ],
    bestFor: [
      "문화/하위문화 이해",
      "조직 문화 연구",
      "공유된 믿음/가치 탐구",
      "맥락적 이해",
    ],
  },
  narrative: {
    korean: "내러티브 연구",
    description: "개인의 삶의 이야기를 통해 경험과 정체성을 이해하는 연구 접근",
    variants: ["Life History", "Oral History", "Biographical", "Narrative Inquiry"],
    keyFeatures: [
      "스토리텔링 중심",
      "시간적 순서",
      "맥락과 의미 연결",
      "공동 구성(Co-construction)",
    ],
    bestFor: [
      "개인 생애 경험 이해",
      "정체성 형성 과정",
      "전환점/중요 사건 탐구",
      "역사적 경험 기록",
    ],
  },
  case_study: {
    korean: "사례연구",
    description: "맥락 내에서 현상을 심층적으로 탐구하는 연구 접근",
    variants: ["Yin (설명적)", "Stake (해석적)", "Merriam (질적)", "Multiple Case"],
    keyFeatures: [
      "경계 지어진 시스템",
      "다중 자료원",
      "맥락 중요성",
      "이론적 일반화",
    ],
    bestFor: [
      "복잡한 현상 이해",
      "'어떻게/왜' 질문",
      "맥락이 중요한 연구",
      "실제 사례 심층 탐구",
    ],
  },
};

export async function getMethodology(args: Record<string, unknown>) {
  const { methodology, variant } = inputSchema.parse(args);

  const info = METHODOLOGY_INFO[methodology];

  // Search for additional details from knowledge base
  const searchQuery = variant
    ? `${info.korean} ${variant}`
    : info.korean;

  const additionalInfo = await searchKnowledgeBase(searchQuery, "traditions", 3);

  return {
    methodology: methodology,
    korean_name: info.korean,
    description: info.description,
    variants: info.variants,
    key_features: info.keyFeatures,
    best_for: info.bestFor,
    requested_variant: variant || "전체",
    additional_resources: additionalInfo.map((r) => ({
      content: r.content,
      source: r.metadata.source,
    })),
    recommendations: {
      sample_size: getSampleSizeRecommendation(methodology),
      data_collection: getDataCollectionMethods(methodology),
      analysis_approach: getAnalysisApproach(methodology),
    },
  };
}

function getSampleSizeRecommendation(methodology: string): string {
  const recommendations: Record<string, string> = {
    phenomenology: "3-25명 (일반적으로 5-10명)",
    grounded_theory: "20-60명 (이론적 포화까지)",
    ethnography: "문화공유집단 1개 (다수의 정보제공자)",
    narrative: "1-5명 (심층적 이야기)",
    case_study: "1-5개 사례",
  };
  return recommendations[methodology] || "연구 목적에 따라 다름";
}

function getDataCollectionMethods(methodology: string): string[] {
  const methods: Record<string, string[]> = {
    phenomenology: ["심층면담", "서면 기술", "예술적 표현"],
    grounded_theory: ["면담", "관찰", "문서", "메모"],
    ethnography: ["참여관찰", "면담", "현장노트", "문화적 인공물"],
    narrative: ["생애사 면담", "문서", "사진/일기"],
    case_study: ["면담", "관찰", "문서", "물리적 인공물", "시청각 자료"],
  };
  return methods[methodology] || ["면담", "관찰", "문서"];
}

function getAnalysisApproach(methodology: string): string {
  const approaches: Record<string, string> = {
    phenomenology: "현상학적 환원, 본질 기술, 의미단위 분석",
    grounded_theory: "개방코딩 → 축코딩 → 선택코딩, 지속적 비교분석",
    ethnography: "문화적 주제 분석, 두꺼운 기술, 문화적 해석",
    narrative: "이야기 구조 분석, 시간적 배열, 의미 해석",
    case_study: "사례 내 분석, 교차사례 분석, 패턴 매칭",
  };
  return approaches[methodology] || "주제 분석";
}
