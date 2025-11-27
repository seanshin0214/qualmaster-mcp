/**
 * Prompt templates for Dr. QualMaster MCP Server
 */

export const PROMPTS = {
  // 방법론 추천 프롬프트
  suggestMethodology: `
연구 질문과 맥락을 분석하여 적합한 질적연구 방법론을 추천합니다.

연구 질문: {{research_question}}
연구 목적: {{purpose}}
참여자 특성: {{participants}}
데이터 유형: {{data_type}}

추천 시 고려할 사항:
1. 연구 질문의 성격 (경험 탐색, 과정 이해, 문화 분석 등)
2. 인식론적 일관성
3. 실현 가능성
4. 연구자 역량
`,

  // 자동 코딩 프롬프트
  autoCoding: `
다음 텍스트에 대해 {{methodology}} 방법론에 맞는 코딩을 제안합니다.

텍스트:
{{text}}

기존 코드 목록:
{{existing_codes}}

코딩 지침:
- In-vivo 코드 (참여자 언어 그대로)
- 서술적 코드
- 해석적 코드
- 패턴 코드
를 구분하여 제안해주세요.
`,

  // 주제 추출 프롬프트
  extractThemes: `
다음 코드들을 분석하여 상위 주제를 도출합니다.

코드 목록:
{{codes}}

관련 세그먼트:
{{segments}}

분석 모드: {{mode}}

주제 도출 시:
1. 코드 간 연결 패턴 식별
2. 상위 개념으로 추상화
3. 주제 간 관계 맵핑
4. 잠재적 이론적 범주 제안
`,

  // 품질 평가 프롬프트
  assessQuality: `
다음 연구를 {{criteria}} 기준으로 평가합니다.

연구 설명:
{{research_description}}

사용된 전략:
{{strategies_used}}

Lincoln & Guba 기준:
- Credibility (신빙성)
- Transferability (전이가능성)
- Dependability (의존가능성)
- Confirmability (확인가능성)

Tracy 8대 기준:
- Worthy topic
- Rich rigor
- Sincerity
- Credibility
- Resonance
- Significant contribution
- Ethical
- Meaningful coherence
`,

  // 개념화 프롬프트
  conceptualizeIdea: `
다음 아이디어를 학술적 개념으로 발전시킵니다.

초기 아이디어: {{idea}}
관련 현상: {{phenomenon}}
기존 관련 개념: {{existing_concepts}}

개념화 과정:
1. 핵심 속성 정의
2. 경계 조건 명시
3. 기존 개념과의 차별화
4. 이론적 위치 설정
5. 조작적 정의 제안
`,

  // 명제 개발 프롬프트
  developProposition: `
다음 개념에 대한 이론적 명제를 개발합니다.

핵심 개념: {{concept}}
관계 변수: {{relationships}}
제안 메커니즘: {{mechanism}}

명제 개발 시:
1. 변수 간 방향성 명시
2. 조건 조항 포함
3. 경계 조건 설정
4. 반증가능성 확보
5. 실증 테스트 가능성 고려
`,

  // 논문 리뷰 프롬프트
  reviewPaper: `
다음 컨셉논문을 100점 체크리스트로 평가합니다.

논문 섹션: {{section}}
논문 내용:
{{paper_text}}

평가 영역:
1. Introduction (20점) - Hook, Gap, So What, Contribution
2. Literature Review (20점) - Integration, Synthesis, Critical Analysis
3. Theory Development (30점) - Novelty, Logic, Mechanisms, Boundary Conditions
4. Discussion (20점) - Implications, Limitations, Future Research
5. Writing Quality (10점) - Clarity, Flow, Academic Conventions
`,

  // 리젝션 진단 프롬프트
  diagnoseRejection: `
다음 리뷰어 코멘트를 분석하여 리젝션 패턴을 진단합니다.

리뷰어 코멘트:
{{reviewer_comments}}

에디터 결정:
{{editor_decision}}

주요 리젝션 패턴:
1. "So What?" - 기여도 불명확
2. "Old Wine in New Bottle" - 신규성 부족
3. "Logic Gap" - 논리적 비약
4. "Boundary Problem" - 경계조건 불명확
5. "Mechanism Missing" - 메커니즘 설명 부재
6. "Literature Gap" - 문헌 검토 부족
7. "Method Mismatch" - 방법론 불일치
`,

  // 수정 가이드 프롬프트
  guideRevision: `
다음 리젝션 패턴에 대한 R&R 대응 전략을 제안합니다.

진단된 패턴: {{rejection_pattern}}
원본 내용: {{original_content}}
리뷰어 코멘트: {{reviewer_comment}}

대응 전략:
1. 직접 대응 (Direct Response)
2. 근거 보강 (Evidence Strengthening)
3. 논리 재구성 (Logic Restructuring)
4. 범위 조정 (Scope Adjustment)
5. 정중한 반박 (Respectful Disagreement)
`,
};

/**
 * Fill template with values
 */
export function fillTemplate(
  template: string,
  values: Record<string, string | string[] | undefined>
): string {
  let result = template;

  for (const [key, value] of Object.entries(values)) {
    const placeholder = `{{${key}}}`;
    const replacement = Array.isArray(value)
      ? value.join("\n- ")
      : (value || "N/A");
    result = result.replace(new RegExp(placeholder, "g"), replacement);
  }

  return result;
}
