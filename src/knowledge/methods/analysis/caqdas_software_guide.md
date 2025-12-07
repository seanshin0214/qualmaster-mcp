# CAQDAS 소프트웨어 완벽 가이드: NVivo, ATLAS.ti, MAXQDA

## 1. 소프트웨어 선택 기준

### 비교 매트릭스
```
| 기능/특성 | NVivo 14 | ATLAS.ti 23 | MAXQDA 2024 |
|-----------|----------|-------------|-------------|
| 가격 | $$$ | $$ | $$ |
| 학습 곡선 | 중간 | 높음 | 낮음 |
| 팀 협업 | 우수 | 양호 | 우수 |
| 시각화 | 양호 | 우수 | 우수 |
| Mixed Methods | 우수 | 양호 | 최우수 |
| 한국어 지원 | 제한적 | 없음 | 우수 |
| Mac 지원 | 완전 | 완전 | 완전 |
```

### 방법론별 추천
```
Grounded Theory → ATLAS.ti (네트워크 뷰)
Phenomenology → NVivo (구조화된 코딩)
Case Study → MAXQDA (사례 비교 기능)
Mixed Methods → MAXQDA (통합 기능 최강)
Team Research → NVivo (서버 협업)
Visual Analysis → ATLAS.ti (가장 직관적)
```

## 2. NVivo 심화 가이드

### 프로젝트 구조 설계
```
NVivo Project
├── Sources (원자료)
│   ├── Internals
│   │   ├── Interviews/
│   │   ├── Focus Groups/
│   │   ├── Documents/
│   │   └── Media/
│   ├── Externals (외부 참조)
│   └── Memos
│       ├── Theoretical Memos/
│       ├── Methodological Memos/
│       └── Reflexive Journals/
│
├── Codes (노드)
│   ├── Initial Codes/
│   ├── Focused Codes/
│   ├── Categories/
│   └── Themes/
│
├── Cases (사례)
│   ├── Participants/
│   └── Sites/
│
├── Classifications (분류)
│   ├── Participant Attributes
│   └── Document Attributes
│
└── Framework Matrices (프레임워크)
```

### 고급 코딩 전략
```
1. Hierarchical Coding
   Theme/
   ├── Sub-theme A/
   │   ├── Code 1
   │   └── Code 2
   └── Sub-theme B/
       └── Code 3

2. In Vivo Coding
   - 참여자 언어 그대로 코드화
   - "" 표시로 구분

3. Relationship Coding
   - Nodes 간 관계 정의
   - Associated, Causes, Contradicts 등

4. Auto Coding
   - 구조화된 데이터에 적합
   - 인터뷰 질문별 자동 분류
```

### 쿼리 활용
```
Word Frequency Query
- 빈출 단어 탐색
- Word cloud 시각화
- Weighted percentage 활용

Text Search Query
- 특정 용어/구문 검색
- Stemming 옵션
- Context 확인

Coding Query
- 코드 조합 탐색
- AND, OR, NOT, NEAR
- 예: "리더십" AND "어려움"

Matrix Coding Query
- 코드 × 속성 교차표
- 패턴 발견
- 수량화 가능

Comparison Query
- 그룹 간 코딩 비교
- 성별, 직급 등 속성별
```

### NVivo Collaboration
```
NVivo Collaboration Server:
- 팀 프로젝트 동시 작업
- 버전 관리
- 권한 설정

Best Practices:
□ 마스터 코드북 공유
□ 정기적 동기화
□ Intercoder reliability 체크
□ Memo 활용한 소통
```

## 3. ATLAS.ti 심화 가이드

### 철학적 접근
ATLAS.ti는 Hermeneutic Unit(HU) 개념 기반 - 해석학적 순환 반영

### 인터페이스 구조
```
ATLAS.ti 작업 환경:
├── Document Manager (P-Docs)
├── Quotation Manager
├── Code Manager
├── Memo Manager
├── Network View ★
└── Query Tool (Query Builder)
```

### 네트워크 뷰 활용 (ATLAS.ti 최강점)
```
네트워크 유형:

1. Code-Code Networks
   - 코드 간 관계 시각화
   - is part of, is associated with
   - is cause of, contradicts

2. Code-Quotation Networks
   - 근거와 코드 연결
   - 증거 추적 용이

3. Conceptual Networks
   - 이론적 관계 표현
   - Grounded Theory에 적합

관계 유형 (Link Types):
- is part of (부분-전체)
- is cause of (인과)
- is associated with (연관)
- contradicts (모순)
- is property of (속성)
- justifies (정당화)
```

### Smart Coding
```
AI 기반 자동 코딩:
- 주제 모델링 활용
- 유사 문장 자동 식별
- 검토 후 수용/거부

OpenAI Integration:
- GPT 기반 코드 제안
- 자동 요약
- 주제 탐색 지원
```

### Co-occurrence Analysis
```
목적:
- 코드 동시출현 패턴 분석
- 연관성 발견

출력:
- Co-occurrence Table
- Sankey Diagram
- Network Visualization

해석:
- 빈번한 동시출현 = 관련 주제
- 패턴 = 이론적 관계
```

## 4. MAXQDA 심화 가이드

### Mixed Methods 최강 기능
```
MAXQDA Stats:
- 빈도 통계 자동 계산
- 코딩 데이터 SPSS로 내보내기
- 속성 기반 분석

Joint Display:
- 질적-양적 데이터 통합 시각화
- Convergent design에 최적

Typology Table:
- 사례 × 속성 매트릭스
- 유형화 분석 지원
```

### 문서 초상화 (Document Portrait)
```
기능:
- 문서 전체를 시각화
- 코드별 색상 분포
- 문서 간 패턴 비교

활용:
- 인터뷰 구조 파악
- 주제 분포 확인
- 사례 간 비교
```

### Interactive Quote Matrix
```
구성:
├── 행: 문서/사례
├── 열: 코드
└── 셀: 인용문

기능:
- 사례 비교 용이
- 패턴 식별
- 보고서 작성 지원
```

### MAXQDA TeamCloud
```
클라우드 협업:
- 실시간 동기화
- 팀원별 권한
- 코딩 비교 도구
- 채팅/코멘트
```

## 5. 소프트웨어 보고 가이드

### 방법 섹션 기술
```
표준 보고 예시:

"Data were managed and analyzed using [NVivo 14/
ATLAS.ti 23/MAXQDA 2024]. Following [method/tradition],
we engaged in iterative cycles of coding.

Initial open coding generated [N] codes, which were
subsequently organized into [N] categories through
axial coding. The software's [specific feature] 
facilitated [specific analytical task].

[For team research]: Intercoder reliability was
assessed using [software feature], with Cohen's
kappa of [value] achieved after three rounds of
calibration."
```

### 심사자 대응
```
"Which software did you use?"
→ 구체적 버전과 활용 기능 명시
→ 분석 과정 설명에 통합

"How did software influence analysis?"
→ 도구로서의 역할 강조
→ 분석적 결정은 연구자가
→ 소프트웨어 ≠ 분석 방법

"Trustworthiness without software?"
→ 소프트웨어 = 조직/관리 도구
→ 엄밀성은 절차에서 확보
→ Audit trail 문서화 강조
```

## 6. 고급 기능 비교

### 자동화/AI 기능
```
NVivo 14:
- Auto Coding by structure
- Theme discovery (AI)
- Sentiment analysis

ATLAS.ti 23:
- Smart Coding (AI)
- OpenAI integration
- Automatic summarization

MAXQDA 2024:
- AI Assist
- Automatic keyword coding
- MAXDictio (내용분석)
```

### 시각화 비교
```
Network/Concept Maps:
- ATLAS.ti: ★★★★★ (최강)
- MAXQDA: ★★★★
- NVivo: ★★★

Statistical Charts:
- MAXQDA: ★★★★★ (최강)
- NVivo: ★★★★
- ATLAS.ti: ★★★

Document Visualization:
- MAXQDA: ★★★★★ (Document Portrait)
- ATLAS.ti: ★★★★
- NVivo: ★★★
```

## 7. 일반적 실수와 해결

### 실수 1: 과도한 코드 생성
```
문제: 수백 개의 산발적 코드
해결: 
- 초기 10-20개로 시작
- 정기적 코드 통합
- 코드북 계층화
```

### 실수 2: 소프트웨어 = 분석
```
문제: 기술적 작업에 치중
해결:
- 정기적 거리두기
- 분석 메모 작성
- 인쇄물 검토 병행
```

### 실수 3: 팀 간 불일치
```
문제: 코딩 해석 차이
해결:
- 상세 코드북 개발
- 정기 캘리브레이션
- Intercoder reliability 체크
```

## 8. 참고 자료

### 공식 자료
- NVivo: qsrinternational.com/nvivo
- ATLAS.ti: atlasti.com
- MAXQDA: maxqda.com

### 방법론 문헌
- Silver, C., & Lewins, A. (2014). *Using software in qualitative research* (2nd ed.). Sage.
- Saldaña, J. (2021). *The coding manual for qualitative researchers* (4th ed.). Sage.
