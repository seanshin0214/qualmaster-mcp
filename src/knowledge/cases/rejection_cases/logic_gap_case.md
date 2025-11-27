# "Logic Gap" 리젝션 사례 분석

## 패턴 개요

### 정의
"Logic Gap" 리젝션은 논문의 이론적 논증에 논리적 비약이나 연결 고리 부재가 있을 때 발생합니다.

### 전형적인 리뷰어 코멘트

```
"The theoretical logic is weak/flawed."

"There is a logical leap between A and B."

"The mechanism linking X to Y is not well specified."

"I don't see how the argument follows from the premises."

"The connection is asserted rather than argued."

"Why would this relationship exist? The paper doesn't explain."
```

## 실제 사례

### 가상 사례: "Idea Helplessness"

**투고 내용**
- 핵심 명제: "반복적인 아이디어 거부 경험은 아이디어 무력감(Idea Helplessness)을 유발하고, 이는 창의적 행동을 억제한다"

**원본 논증**
```
P1: 조직에서 직원의 아이디어가 반복적으로 거부된다
P2: 이로 인해 아이디어 무력감이 발생한다
P3: 아이디어 무력감은 창의적 행동을 억제한다
결론: 아이디어 거부는 창의성을 저해한다
```

**리뷰어 피드백**
```
Reviewer 1:
"The link between idea rejection and 'helplessness' is not
adequately theorized. Why would rejection in one domain (ideas)
generalize to a broader state of helplessness? This is a
significant logical leap."

Reviewer 2:
"The paper asserts that repeated rejection leads to helplessness,
but doesn't explain the psychological mechanism. What cognitive
or emotional processes are involved? How many rejections?
Under what conditions?"

Reviewer 3:
"I'm not convinced that 'helplessness' is the right framing.
Couldn't rejection lead to other responses like anger, withdrawal,
or even increased effort? The paper needs to justify why
helplessness specifically."
```

### 문제 진단

**Logic Gap 위치**
```
아이디어 거부 → [??? GAP ???] → 아이디어 무력감
                    ↓
            메커니즘 미설명
            대안적 결과 미고려
            조건 미명시
```

**근본 원인**
1. 중간 단계 생략
2. 메커니즘 불명확
3. 경계 조건 부재
4. 대안 설명 무시

## 수정 전략

### 전략 1: 메커니즘 명시화

**단계별 분해**

```
원래: A → B (거부 → 무력감)

수정: A → M1 → M2 → M3 → B

구체적으로:
아이디어 거부
    ↓
[M1: 인지적 평가]
"내 아이디어는 가치 없다"는 귀인
    ↓
[M2: 정서적 반응]
좌절감, 무가치감 경험
    ↓
[M3: 학습된 기대]
"어차피 아이디어 내도 거부될 것"이라는 예측
    ↓
아이디어 무력감 (Idea Helplessness)
```

### 전략 2: 이론적 근거 추가

**기존 이론 활용**

```
학습된 무력감 이론 (Seligman, 1975)
  - 통제 불가능한 부정적 결과 → 무력감
  - 귀인 스타일: 내적, 안정적, 전반적

아이디어 거부 맥락 적용:
  - 통제 불가능: 아이디어 수용 결정권 없음
  - 부정적 결과: 반복적 거부
  - 귀인: "내 아이디어가 본질적으로 부족해서" (내적, 안정적)

→ 따라서 학습된 무력감이 아이디어 영역에서 발현될 것으로 예측
```

### 전략 3: 경계 조건 명시

**언제 거부가 무력감으로 이어지는가?**

```
조건 1: 거부의 빈도
  - 단발적 거부 vs 반복적 거부
  - 3회 이상의 연속 거부 시 무력감 발생 가능성 증가

조건 2: 거부의 방식
  - 설명 있는 거부 vs 설명 없는 거부
  - 무설명 거부가 무력감을 더 유발

조건 3: 개인적 특성
  - 귀인 스타일: 내적-안정적 귀인 성향 시 취약
  - 회복탄력성: 낮은 회복탄력성 시 취약

조건 4: 맥락적 요인
  - 심리적 안전감이 낮은 환경
  - 아이디어가 자아 정체성과 연결된 경우
```

### 전략 4: 대안적 결과 고려

```
아이디어 거부의 가능한 결과들:

1. 무력감 (Helplessness) - 본 연구 초점
   조건: 통제 불가능 인식, 내적 귀인

2. 분노 (Anger)
   조건: 불공정 인식, 외적 귀인

3. 철회 (Withdrawal)
   조건: 관계 회피 동기, 감정적 거리두기

4. 증가된 노력 (Increased Effort)
   조건: 높은 자기효능감, 도전 지향

왜 무력감에 초점?
- 가장 비가시적이고 장기적인 피해
- 기존 연구에서 간과됨
- 조직적 개입으로 예방 가능
```

## 수정된 논증

### Before (Gap 있음)
```
아이디어가 반복 거부된다
     ↓
(왜?)
     ↓
아이디어 무력감이 발생한다
```

### After (Gap 해소)
```
아이디어가 반복 거부된다
     ↓
[귀인 과정] 직원은 거부 원인을 탐색한다.
내적-안정적 귀인 시 ("내 아이디어가 원래 부족해서"),
     ↓
[정서적 결과] 좌절감과 무가치감을 경험한다.
     ↓
[인지적 결과] 미래 시도도 거부될 것이라는
학습된 기대가 형성된다 (Seligman, 1975).
     ↓
[행동적 결과] 아이디어 무력감:
아이디어 생성과 제안 동기가 저하된다.

단, 이 경로는 다음 조건에서 강화된다:
- 심리적 안전감 부재
- 설명 없는 거부
- 낮은 회복탄력성
```

## Response Letter 예시

```markdown
### Reviewer 1 Comment 1.2

> The link between idea rejection and 'helplessness' is not
> adequately theorized. Why would rejection in one domain
> generalize to helplessness?

**Response**: We thank the reviewer for identifying this
critical gap in our theorizing. We have substantially
strengthened the theoretical logic by:

1. **Articulating the mechanism** (pp. 12-15):
   We now detail the cognitive-emotional process:
   rejection → attribution → emotional response →
   learned expectation → helplessness.

2. **Grounding in established theory** (pp. 10-12):
   We explicitly connect to Seligman's (1975) learned
   helplessness theory, showing how the three key
   conditions (uncontrollability, negative outcome,
   attribution style) apply to the idea rejection context.

3. **Specifying boundary conditions** (pp. 15-18):
   We clarify when rejection leads to helplessness vs.
   other outcomes (anger, withdrawal, increased effort),
   including frequency, manner of rejection, individual
   differences, and contextual factors.

4. **Addressing alternative outcomes** (pp. 18-20):
   We acknowledge that rejection can lead to multiple
   outcomes and explain why helplessness merits
   specific attention.

See revised manuscript, pp. 10-20.
```

## 예방 전략

### 논증 점검 체크리스트

각 명제 연결에 대해:
- [ ] 왜 A가 B로 이어지는가?
- [ ] 어떤 메커니즘/과정이 작동하는가?
- [ ] 기존 이론이 지지하는가?
- [ ] 언제/어떤 조건에서 성립하는가?
- [ ] 대안적 결과는 없는가?

### 시각화 도구

**인과 사슬 다이어그램**
```
[A] ---(메커니즘 1)---> [B] ---(메커니즘 2)---> [C]
         |                      |
    [이론적 근거]          [이론적 근거]
         |                      |
    [경계 조건]            [경계 조건]
```

## 핵심 교훈

1. **모든 연결에 "왜"**: 각 화살표마다 설명
2. **이론적 뒷받침**: 기존 이론에서 근거 차용
3. **경계 조건**: 언제 성립하고 언제 안 되는지
4. **대안 고려**: 다른 결과 가능성 인정하고 설명
5. **단계 분해**: 큰 점프 대신 작은 단계들로
