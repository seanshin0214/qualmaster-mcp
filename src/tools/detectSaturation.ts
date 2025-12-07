import { z } from "zod";

export const detectSaturationSchema = {
  type: "object",
  properties: {
    codes: {
      type: "array",
      items: { type: "string" },
      description: "전체 코드 목록",
    },
    new_codes_by_source: {
      type: "object",
      description: "데이터 소스별 새 코드 (예: {source1: [code1, code2], source2: [...]})",
    },
    level: {
      type: "string",
      enum: ["code", "theme", "theoretical"],
      description: "포화 수준",
    },
  },
  required: ["codes"],
} as const;

const inputSchema = z.object({
  codes: z.array(z.string()),
  new_codes_by_source: z.record(z.array(z.string())).optional().default({}),
  level: z.enum(["code", "theme", "theoretical"]).optional().default("code"),
});

interface SaturationMetrics {
  total_codes: number;
  total_sources: number;
  new_code_rate: number;
  cumulative_new_codes: number[];
  saturation_point_estimate: number | null;
}

interface SaturationAssessment {
  level: string;
  status: "not_reached" | "approaching" | "reached" | "exceeded";
  confidence: number;
  evidence: string[];
  recommendations: string[];
}

export async function detectSaturation(args: Record<string, unknown>) {
  // Defensive coding
  if (!args || typeof args !== 'object' || !args.codes || !Array.isArray(args.codes) || args.codes.length === 0) {
    return {
      error: true,
      message: "detect_saturation 도구에 필수 인자 'codes'가 전달되지 않았습니다.",
      required_parameters: { codes: "(필수) 전체 코드 목록" },
      example: { codes: ["코드1", "코드2"], level: "code" }
    };
  }

  const { codes, new_codes_by_source, level } = inputSchema.parse(args);

  // Calculate saturation metrics
  const metrics = calculateSaturationMetrics(codes, new_codes_by_source);

  // Assess saturation based on level
  const assessment = assessSaturation(metrics, level);

  // Generate visualization data
  const visualizationData = generateVisualizationData(new_codes_by_source);

  return {
    level,
    metrics: {
      total_codes: metrics.total_codes,
      total_sources: metrics.total_sources,
      new_code_rate: `${(metrics.new_code_rate * 100).toFixed(1)}%`,
      estimated_saturation_point: metrics.saturation_point_estimate
        ? `Source ${metrics.saturation_point_estimate}`
        : "아직 도달하지 않음",
    },
    assessment: {
      status: assessment.status,
      status_korean: getStatusKorean(assessment.status),
      confidence: `${assessment.confidence}%`,
      evidence: assessment.evidence,
    },
    cumulative_analysis: {
      codes_by_source: visualizationData.cumulativeCodes,
      new_codes_by_source: visualizationData.newCodesBySource,
      trend: analyzeTrend(visualizationData.newCodesBySource),
    },
    recommendations: assessment.recommendations,
    saturation_guidelines: getSaturationGuidelines(level),
    next_steps: getNextSteps(assessment.status),
  };
}

function calculateSaturationMetrics(
  codes: string[],
  newCodesBySource: Record<string, string[]>
): SaturationMetrics {
  const sources = Object.keys(newCodesBySource);
  const totalSources = sources.length;

  // Calculate cumulative new codes
  let cumulativeTotal = 0;
  const cumulativeNewCodes: number[] = [];

  for (const source of sources) {
    const newCodes = newCodesBySource[source] || [];
    cumulativeTotal += newCodes.length;
    cumulativeNewCodes.push(cumulativeTotal);
  }

  // Calculate new code rate (last 3 sources)
  const recentSources = sources.slice(-3);
  const recentNewCodes = recentSources.reduce(
    (sum, s) => sum + (newCodesBySource[s]?.length || 0),
    0
  );
  const newCodeRate = totalSources > 0 ? recentNewCodes / (recentSources.length * 5) : 0;

  // Estimate saturation point
  let saturationPoint: number | null = null;
  for (let i = 2; i < sources.length; i++) {
    const lastThree = [
      newCodesBySource[sources[i - 2]]?.length || 0,
      newCodesBySource[sources[i - 1]]?.length || 0,
      newCodesBySource[sources[i]]?.length || 0,
    ];
    if (lastThree.every((n) => n <= 1)) {
      saturationPoint = i + 1;
      break;
    }
  }

  return {
    total_codes: codes.length,
    total_sources: totalSources,
    new_code_rate: newCodeRate,
    cumulative_new_codes: cumulativeNewCodes,
    saturation_point_estimate: saturationPoint,
  };
}

function assessSaturation(metrics: SaturationMetrics, level: string): SaturationAssessment {
  const evidence: string[] = [];
  const recommendations: string[] = [];
  let status: "not_reached" | "approaching" | "reached" | "exceeded";
  let confidence: number;

  // Level-specific thresholds
  const thresholds: Record<string, { minCodes: number; minSources: number; maxRate: number }> = {
    code: { minCodes: 30, minSources: 8, maxRate: 0.1 },
    theme: { minCodes: 50, minSources: 12, maxRate: 0.05 },
    theoretical: { minCodes: 80, minSources: 20, maxRate: 0.02 },
  };

  const threshold = thresholds[level] || thresholds.code;

  // Assess based on metrics
  if (metrics.new_code_rate <= threshold.maxRate && metrics.total_sources >= threshold.minSources) {
    if (metrics.new_code_rate === 0) {
      status = "exceeded";
      confidence = 95;
      evidence.push("최근 데이터에서 새로운 코드가 발견되지 않음");
    } else {
      status = "reached";
      confidence = 85;
      evidence.push(`새 코드 발생률이 ${(metrics.new_code_rate * 100).toFixed(1)}%로 낮음`);
    }
  } else if (
    metrics.new_code_rate <= threshold.maxRate * 2 &&
    metrics.total_sources >= threshold.minSources * 0.7
  ) {
    status = "approaching";
    confidence = 60;
    evidence.push("포화에 근접하고 있으나 추가 확인 필요");
    recommendations.push("2-3개의 추가 데이터 소스를 분석하세요");
  } else {
    status = "not_reached";
    confidence = 40;
    evidence.push("아직 새로운 코드가 지속적으로 발생하고 있음");
    recommendations.push("더 많은 데이터 수집이 필요합니다");
  }

  // Add context-specific evidence
  if (metrics.total_codes < threshold.minCodes) {
    evidence.push(`총 코드 수(${metrics.total_codes})가 권장 최소치(${threshold.minCodes}) 미만`);
    recommendations.push("더 많은 코딩이 필요합니다");
  }

  if (metrics.total_sources < threshold.minSources) {
    evidence.push(
      `데이터 소스 수(${metrics.total_sources})가 권장 최소치(${threshold.minSources}) 미만`
    );
  }

  // Add level-specific recommendations
  if (level === "theoretical" && status !== "reached") {
    recommendations.push("핵심 범주 간의 관계가 명확해질 때까지 분석을 계속하세요");
    recommendations.push("이론적 메모를 통해 관계를 정교화하세요");
  }

  return { level, status, confidence, evidence, recommendations };
}

function getStatusKorean(status: string): string {
  const statusMap: Record<string, string> = {
    not_reached: "미도달",
    approaching: "근접",
    reached: "도달",
    exceeded: "충분히 도달",
  };
  return statusMap[status] || status;
}

function generateVisualizationData(newCodesBySource: Record<string, string[]>) {
  const sources = Object.keys(newCodesBySource);
  const newCodesBySourceArray: number[] = [];
  const cumulativeCodes: number[] = [];

  let cumulative = 0;
  for (const source of sources) {
    const count = newCodesBySource[source]?.length || 0;
    newCodesBySourceArray.push(count);
    cumulative += count;
    cumulativeCodes.push(cumulative);
  }

  return {
    sources,
    newCodesBySource: newCodesBySourceArray,
    cumulativeCodes,
  };
}

function analyzeTrend(newCodes: number[]): string {
  if (newCodes.length < 3) return "데이터 부족";

  const lastThree = newCodes.slice(-3);
  const avgLast = lastThree.reduce((a, b) => a + b, 0) / lastThree.length;

  const firstThree = newCodes.slice(0, 3);
  const avgFirst = firstThree.reduce((a, b) => a + b, 0) / firstThree.length;

  if (avgLast < avgFirst * 0.3) return "급격히 감소 (포화 근접)";
  if (avgLast < avgFirst * 0.6) return "점진적 감소";
  if (avgLast > avgFirst) return "증가 (포화 미도달)";
  return "안정적";
}

function getSaturationGuidelines(level: string): Record<string, string> {
  const guidelines: Record<string, Record<string, string>> = {
    code: {
      definition: "더 이상 새로운 코드가 나타나지 않는 상태",
      indicators: "연속 3개 이상의 데이터에서 새 코드 없음",
      minimum_requirement: "일반적으로 8-15개 면담",
    },
    theme: {
      definition: "더 이상 새로운 주제가 나타나지 않는 상태",
      indicators: "주요 주제가 반복적으로 확인됨",
      minimum_requirement: "일반적으로 12-20개 면담",
    },
    theoretical: {
      definition: "범주 간 관계가 명확하고 이론이 정교화된 상태",
      indicators: "핵심 범주 중심의 통합적 이론 완성",
      minimum_requirement: "일반적으로 20-30개 이상 면담",
    },
  };

  return guidelines[level] || guidelines.code;
}

function getNextSteps(status: string): string[] {
  const steps: Record<string, string[]> = {
    not_reached: [
      "추가 데이터 수집 계획을 수립하세요",
      "이론적 표본추출로 다양한 사례를 포함하세요",
      "기존 코드의 속성과 차원을 더 탐색하세요",
    ],
    approaching: [
      "2-3개의 추가 면담을 진행하세요",
      "새로운 정보가 나타나는지 모니터링하세요",
      "기존 범주의 완전성을 검토하세요",
    ],
    reached: [
      "분석을 마무리하고 글쓰기를 시작하세요",
      "포화 도달 과정을 방법론 섹션에 기술하세요",
      "동료 검토를 통해 확인하세요",
    ],
    exceeded: [
      "분석 결과를 정리하세요",
      "이론적 틀을 완성하세요",
      "연구 결과를 논문으로 작성하세요",
    ],
  };

  return steps[status] || steps.not_reached;
}
