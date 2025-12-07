# Content Analysis: 체계적 텍스트 분석 마스터 가이드

## 1. Content Analysis의 본질

### 정의와 인식론적 위치
Content Analysis는 텍스트, 이미지, 미디어 콘텐츠를 체계적으로 분류하고 해석하는 방법론이다.

```
인식론적 스펙트럼:
├── Quantitative Content Analysis (실증주의)
│   ├── 빈도 계수 중심
│   ├── 코딩 신뢰도 강조
│   └── 통계적 추론
│
├── Qualitative Content Analysis (해석주의)
│   ├── Krippendorff의 질적 접근
│   ├── 맥락적 의미 해석
│   └── 잠재적 내용 분석
│
└── Directed Content Analysis (이론 기반)
    ├── 기존 이론으로 시작
    ├── 연역적 코딩
    └── 이론 확장/검증
```

### Hsieh & Shannon (2005) 3가지 접근법

#### 1. Conventional Content Analysis
- **시작점**: 데이터에서 출발
- **코딩**: 귀납적 코드 생성
- **적합한 경우**: 현상에 대한 이론이 부족할 때
- **대표 저널**: Qualitative Health Research

#### 2. Directed Content Analysis
- **시작점**: 기존 이론/개념틀
- **코딩**: 연역적 코드 + 새로운 코드 추가
- **적합한 경우**: 이론 확장/검증이 목적일 때
- **대표 저널**: Implementation Science

#### 3. Summative Content Analysis
- **시작점**: 특정 단어/구문 식별
- **코딩**: 빈도 계수 → 맥락 해석
- **적합한 경우**: 특정 개념의 사용 패턴 분석
- **대표 저널**: Health Communication

## 2. Krippendorff의 체계적 접근

### 6단계 분석 절차
```
1. Unitizing (단위화)
   └── 분석 단위 결정 (단어, 문장, 문단, 문서)

2. Sampling (표집)
   └── 분석 대상 선정 및 정당화

3. Recording/Coding (기록/코딩)
   └── 코딩 규칙과 절차 수립

4. Reducing (축소)
   └── 데이터를 관리 가능한 형태로 변환

5. Inferring (추론)
   └── 맥락적 의미 도출

6. Narrating (서술)
   └── 발견의 서술과 해석
```

### 분석 단위 유형
| 단위 유형 | 정의 | 예시 | 적합한 연구 |
|----------|------|------|-------------|
| Sampling Unit | 분석 대상 선정 단위 | 기사, 문서 | 미디어 분석 |
| Recording Unit | 코딩 적용 단위 | 문장, 문단 | 주제 분석 |
| Context Unit | 의미 해석 맥락 | 전체 문서 | 담론 분석 |

## 3. 코딩 시스템 개발

### 코드북 구성 요소
```markdown
## 코드북 템플릿

### 코드 ID: [고유번호]
### 코드명: [명칭]
### 정의: [조작적 정의]
### 포함 기준:
- 기준 1
- 기준 2
### 배제 기준:
- 배제 1
- 배제 2
### 예시:
- 포함 예: "..."
- 배제 예: "..."
### 의사결정 규칙:
- 애매한 경우 처리 방법
```

### 코더 간 신뢰도 (Intercoder Reliability)

#### 계수 유형과 기준
| 계수 | 공식 | 수용 기준 | 적합한 상황 |
|------|------|----------|-------------|
| Percent Agreement | 일치수/전체수 | ≥80% | 탐색적 연구 |
| Cohen's Kappa | 우연 일치 보정 | ≥0.70 | 2명 코더 |
| Krippendorff's Alpha | 다수 코더, 결측 허용 | ≥0.80 | 엄격한 연구 |
| Scott's Pi | 한계 분포 동일 가정 | ≥0.75 | 명목 데이터 |

#### 신뢰도 향상 전략
1. **코더 훈련**: 최소 10% 데이터로 연습
2. **파일럿 테스트**: 초기 신뢰도 확인 및 조정
3. **불일치 논의**: 정기적 calibration 회의
4. **의사결정 규칙**: 명확한 판단 기준 문서화

## 4. Mayring의 질적 내용분석

### 3가지 분석 기법

#### 1. Summarizing (요약)
```
목적: 자료를 핵심 내용으로 축약
절차:
1. Paraphrasing - 비필수 요소 제거
2. Generalization - 추상화 수준 상향
3. First Reduction - 유사 의미 통합
4. Second Reduction - 더 높은 수준 통합
```

#### 2. Explicating (해명)
```
목적: 불분명한 텍스트 부분 명료화
유형:
├── Narrow Context Analysis
│   └── 텍스트 내부에서 의미 탐색
└── Wide Context Analysis
    └── 외부 자료로 의미 보충
```

#### 3. Structuring (구조화)
```
목적: 특정 기준으로 자료 체계화
유형:
├── Formal Structuring - 형식적 특성 분석
├── Content Structuring - 주제별 분류
├── Typological Structuring - 유형화
└── Scaling Structuring - 척도화
```

## 5. 소프트웨어 활용

### NVivo 활용 전략
```
프로젝트 구조:
├── Sources (원자료)
│   ├── Internals (내부 문서)
│   ├── Externals (외부 참조)
│   └── Memos (연구 메모)
│
├── Codes (노드)
│   ├── Free Nodes (자유 노드)
│   ├── Tree Nodes (계층 노드)
│   └── Relationship Nodes (관계 노드)
│
└── Queries (쿼리)
    ├── Word Frequency
    ├── Text Search
    ├── Matrix Coding
    └── Framework Matrix
```

### ATLAS.ti 고급 기능
- **Network View**: 코드 간 관계 시각화
- **Co-occurrence Analysis**: 코드 동시출현 분석
- **Quotation Manager**: 인용문 체계적 관리

### MAXQDA 특화 기능
- **Document Portrait**: 문서별 코딩 시각화
- **Code Relations Browser**: 코드 관계 탐색
- **Mixed Methods Functions**: 양적-질적 통합

## 6. 저널별 보고 기준

### Qualitative Health Research
```
필수 보고 요소:
□ 분석 접근법 명시 (Hsieh & Shannon 유형)
□ 분석 단위 정의
□ 코딩 절차 상세 기술
□ 신뢰도 확보 방법 (있는 경우)
□ 리플렉시비티 논의
```

### Implementation Science
```
Directed Content Analysis 요구사항:
□ 선험적 코딩 틀 출처 명시
□ 연역적/귀납적 코드 구분
□ 새로운 코드 생성 과정
□ 이론적 프레임워크와의 정합성
```

### Health Communication
```
Summative Approach 보고:
□ 키워드 선정 근거
□ 빈도 분석 결과
□ 맥락적 해석 과정
□ 잠재적 의미 도출 논리
```

## 7. 질적 vs 양적 내용분석 비교

| 차원 | 양적 내용분석 | 질적 내용분석 |
|------|-------------|-------------|
| 목적 | 빈도 계수, 패턴 발견 | 의미 해석, 맥락 이해 |
| 코딩 | 표준화, 폐쇄형 | 유연, 개방형 |
| 신뢰도 | 통계적 계수 필수 | 절차적 엄밀성 |
| 타당도 | 외적 타당도 중시 | 내적 타당도 중시 |
| 일반화 | 모집단 추론 | 이론적 일반화 |
| 보고 | 표, 그래프 | 풍부한 기술, 인용 |

## 8. 고급 분석 기법

### Latent Content Analysis
```
Manifest Content (현시적 내용)
├── 표면적으로 드러난 것
├── 직접적 관찰 가능
└── 높은 신뢰도

Latent Content (잠재적 내용)
├── 숨겨진 의미, 맥락
├── 해석 필요
└── 깊은 통찰
```

### Framework Analysis (Ritchie & Spencer)
```
5단계:
1. Familiarization - 자료 숙지
2. Identifying Framework - 주제 틀 구성
3. Indexing - 체계적 코딩
4. Charting - 매트릭스 배열
5. Mapping & Interpretation - 패턴 해석
```

### Template Analysis (King)
```
특징:
- 선험적 템플릿으로 시작
- 분석 중 템플릿 수정 허용
- 계층적 코드 구조
- 연역-귀납 혼합 접근
```

## 9. 일반적 실수와 해결책

### 실수 1: 분석 단위 불명확
```
문제: "문서를 분석했다"만 기술
해결: 구체적 단위 명시
      "각 인터뷰 응답을 문장 단위로 분석하되,
       의미 해석은 문단 맥락에서 수행"
```

### 실수 2: 코딩 절차 모호
```
문제: "주제를 도출했다"
해결: 단계별 절차 기술
      "1차 코딩에서 127개 초기 코드 생성,
       축 코딩을 통해 23개 하위범주로 통합,
       최종 7개 핵심 주제 도출"
```

### 실수 3: 신뢰도 누락
```
문제: 단독 연구자가 코딩
해결: 대안적 신뢰성 확보
      - Peer debriefing
      - Member checking
      - Audit trail 문서화
```

## 10. APA 스타일 보고 예시

### 방법 섹션
```
Data Analysis

We employed directed content analysis following
Hsieh and Shannon's (2005) guidelines, using [Theory]
as our initial coding framework. The analysis unit was
defined as each complete thought unit within interview
transcripts.

Two trained coders independently coded 20% of the
data (n = 8 interviews). Initial intercoder reliability
was calculated using Krippendorff's alpha (α = .82),
meeting the recommended threshold of .80 (Krippendorff,
2018). Discrepancies were resolved through discussion
until consensus was reached.

The remaining data were coded by the first author,
with regular peer debriefing sessions with the research
team. NVivo 12 was used for data management and analysis.
```

## 11. 주요 참고문헌

### 필수 문헌
- Hsieh, H. F., & Shannon, S. E. (2005). Three approaches to qualitative content analysis. *Qualitative Health Research, 15*(9), 1277-1288.
- Krippendorff, K. (2018). *Content analysis: An introduction to its methodology* (4th ed.). Sage.
- Mayring, P. (2014). *Qualitative content analysis: Theoretical foundation, basic procedures and software solution*. Klagenfurt.

### 방법론 심화
- Elo, S., & Kyngäs, H. (2008). The qualitative content analysis process. *Journal of Advanced Nursing, 62*(1), 107-115.
- Schreier, M. (2012). *Qualitative content analysis in practice*. Sage.
