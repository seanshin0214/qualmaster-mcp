# 실패 패턴 & R&R 가이드

## 흔한 리젝션 패턴

### 1. "So What?" 패턴

#### 증상
```
"The contribution of this paper is unclear."
"What does this add to what we already know?"
"Why should we care about this?"
```

#### 원인
- 기여 진술 모호
- 기존 연구와 차별점 불명확
- 실무/이론적 함의 부재

#### 처방
1. **서론 강화**
   - 기여를 3문장 이내로 명확히
   - "We contribute by..." 명시적 사용

2. **차별화 표 추가**
   | 기존 연구 | 본 연구 |
   |---------|--------|
   | X 초점 | Y 초점 |
   | A 수준 | B 수준 |

3. **Discussion 강화**
   - 이론적 기여 구체화
   - 실무적 함의 세분화

### 2. "Old Wine in New Bottles" 패턴

#### 증상
```
"This concept overlaps with existing constructs."
"How is this different from X?"
"This seems like a relabeling of known phenomena."
```

#### 원인
- 기존 개념과 유사
- 차별점 논증 부족
- 새 개념의 필요성 미흡

#### 처방
1. **개념 비교표**
   | 측면 | 기존 개념 | 새 개념 |
   |------|---------|--------|
   | 정의 | ... | ... |
   | 초점 | ... | ... |
   | 수준 | ... | ... |

2. **What it is NOT 섹션 추가**
   - 유사 개념과 명시적 구별

3. **새 개념의 고유 설명력 입증**
   - 기존 개념으로 설명 안 되는 현상 제시

### 3. "Logic Gap" 패턴

#### 증상
```
"The theoretical logic is flawed."
"The connection between A and B is not justified."
"There are logical leaps in the argument."
```

#### 원인
- 논리적 비약
- 메커니즘 미설명
- 가정 미명시

#### 처방
1. **단계별 논증 분해**
   ```
   A → (메커니즘 1) → B → (메커니즘 2) → C
   ```

2. **문헌 기반 정당화**
   - 각 연결고리에 선행연구 지지

3. **대안 설명 고려**
   - 반론 예상 및 대응

### 4. "Method Mismatch" 패턴

#### 증상
```
"The method is inappropriate for the research question."
"Why did you choose this approach?"
"The methodology lacks rigor."
```

#### 원인
- 연구질문-방법론 부조화
- 방법론적 정당화 부족
- 품질 기준 미충족

#### 처방
1. **정합성 논증 추가**
   - 패러다임 → 방법론 → 방법 연결

2. **신뢰성 전략 상세화**
   - Lincoln & Guba 기준 적용

3. **대안 방법 논의**
   - 선택 이유 명시

### 5. "Missing Mechanism" 패턴

#### 증상
```
"Why would this relationship exist?"
"What is the underlying process?"
"The mechanism is underspecified."
```

#### 원인
- 왜/어떻게 설명 부재
- 블랙박스 현상
- 과정 미상세화

#### 처방
1. **메커니즘 명시화**
   ```
   X가 Y에 영향을 미치는 이유:
   1. X가 발생하면...
   2. 이로 인해...
   3. 결과적으로 Y가...
   ```

2. **중재변수 탐색**
   - X → M → Y 모델

3. **이론적 근거 제시**
   - 기존 이론에서 메커니즘 차용

## R&R Response 전략

### 전체 원칙

#### DO
- 모든 코멘트 주소
- 구체적 변경 명시
- 감사 표현 (비판에도)
- 근거 기반 대응

#### DON'T
- 코멘트 무시
- 감정적 반응
- 방어적 태도
- 모호한 답변

### Response Letter 템플릿

```markdown
# Response to Reviewers

Dear Editor and Reviewers,

Thank you for the thorough and constructive feedback.
We have carefully addressed all comments as detailed below.

## Summary of Major Revisions
1. [주요 수정 1]
2. [주요 수정 2]
3. [주요 수정 3]

---

## REVIEWER 1

### Comment 1.1
> [리뷰어 코멘트 원문 인용]

**Response**: We appreciate this feedback. We have addressed this by...

**Changes Made**: See page X, lines Y-Z:
> "[수정된 텍스트]"

---

### Comment 1.2
...

---

## REVIEWER 2
...

---

Thank you again for helping us strengthen this manuscript.

Sincerely,
[Authors]
```

### 코멘트 유형별 대응

#### 동의 & 수정
```
Response: We agree with this observation. We have revised
the manuscript to [구체적 수정]. See page X.
```

#### 부분 동의
```
Response: We appreciate this point. We agree that [동의 부분].
However, we believe that [설명]. We have addressed this by
[타협적 수정]. We hope this addresses the concern.
```

#### 정중한 반박
```
Response: We thank the reviewer for this thoughtful comment.
We understand the concern about X. We respectfully maintain
our original position because [근거]. Prior research supports
this view (citations). However, we have added clarification
on page X to address potential confusion.
```

### 수정 사항 표시

#### 원고 내 표시
- 변경된 텍스트 색상 표시 (Track Changes)
- 또는 별도 표시 없이 Response Letter에서 명시

#### Response Letter 내 표시
- 페이지/줄 번호 명시
- 변경 텍스트 직접 인용
- Before/After 비교 (필요시)

## 리젝션 후 전략

### 분석 단계
1. 피드백 차분히 읽기 (1-2일 후)
2. 핵심 문제 식별
3. 수정 가능성 평가
4. 다른 저널 적합성 검토

### 재투고 전략

#### 같은 저널 재투고
- 에디터 권장 시만
- 완전히 새로운 버전으로

#### 다른 저널 투고
- 리뷰어 피드백 반영
- 새 저널 요건 맞춤 수정
- 커버레터에 수정 경위 언급 (선택)

## MCP Tool 활용

- `diagnose_rejection` - 리젝션 패턴 진단
- `guide_revision` - 대응 전략 및 수정 제안
- `review_paper` - 수정본 자체 평가
