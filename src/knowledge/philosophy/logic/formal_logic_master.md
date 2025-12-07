# 형식논리학 마스터 가이드: 신급 연구자를 위한 완벽 체계

## 1. 논리학의 본질과 구조

### 논리학의 정의와 범위
```
논리학 체계:
├── 형식논리학 (Formal Logic)
│   ├── 명제논리학 (Propositional Logic)
│   ├── 술어논리학 (Predicate Logic)
│   ├── 양상논리학 (Modal Logic)
│   └── 다치논리학 (Many-valued Logic)
│
├── 비형식논리학 (Informal Logic)
│   ├── 논증이론 (Argumentation Theory)
│   ├── 비판적 사고 (Critical Thinking)
│   └── 수사학적 분석 (Rhetorical Analysis)
│
├── 수리논리학 (Mathematical Logic)
│   ├── 집합론 (Set Theory)
│   ├── 모형이론 (Model Theory)
│   ├── 증명이론 (Proof Theory)
│   └── 재귀함수론 (Recursion Theory)
│
└── 철학적 논리학 (Philosophical Logic)
    ├── 인식논리학 (Epistemic Logic)
    ├── 시제논리학 (Temporal Logic)
    └── 의무논리학 (Deontic Logic)
```

### 논리학의 역사적 발전
```
고대:
├── 아리스토텔레스 삼단논법 (Syllogism)
├── 스토아 학파 명제논리
└── 중세 scholastic logic

근대:
├── Leibniz의 보편기호학 꿈
├── Boole의 수학적 논리
└── Frege의 개념표기법 (Begriffsschrift)

현대:
├── Russell & Whitehead - Principia Mathematica
├── Gödel - 불완전성 정리
├── Tarski - 진리론
└── Kripke - 가능세계 의미론
```

## 2. 명제논리학 (Propositional Logic)

### 구문론 (Syntax)
```
원자명제: p, q, r, ...
연결사 (Connectives):
├── ¬ (부정, NOT)
├── ∧ (연언, AND)
├── ∨ (선언, OR)
├── → (조건, IF-THEN)
└── ↔ (쌍조건, IFF)

형성규칙:
1. 모든 원자명제는 wff
2. φ가 wff이면 ¬φ도 wff
3. φ, ψ가 wff이면 (φ ∧ ψ), (φ ∨ ψ), (φ → ψ), (φ ↔ ψ)도 wff
```

### 의미론 (Semantics)
```
진리표 (Truth Table):
p | q | p∧q | p∨q | p→q | p↔q
T | T |  T  |  T  |  T  |  T
T | F |  F  |  T  |  F  |  F
F | T |  F  |  T  |  T  |  F
F | F |  F  |  F  |  T  |  T

핵심 개념:
- 항진명제 (Tautology): 모든 해석에서 참
- 모순명제 (Contradiction): 모든 해석에서 거짓
- 우연명제 (Contingency): 참/거짓 모두 가능
- 논리적 귀결 (Logical Consequence): Γ ⊨ φ
```

### 자연연역 (Natural Deduction)
```
도입규칙과 제거규칙:

∧-도입: φ, ψ ⊢ φ∧ψ
∧-제거: φ∧ψ ⊢ φ (또는 ψ)

∨-도입: φ ⊢ φ∨ψ
∨-제거: φ∨ψ, φ→χ, ψ→χ ⊢ χ

→-도입: [φ]...ψ ⊢ φ→ψ (조건증명)
→-제거: φ, φ→ψ ⊢ ψ (Modus Ponens)

¬-도입: [φ]...⊥ ⊢ ¬φ (귀류법)
¬-제거: ¬¬φ ⊢ φ (이중부정 제거)
```

## 3. 술어논리학 (Predicate Logic)

### 1차 술어논리 (First-Order Logic)
```
어휘:
├── 개체상항: a, b, c, ...
├── 개체변항: x, y, z, ...
├── 술어기호: P, Q, R, ...
├── 함수기호: f, g, h, ...
├── 양화사:
│   ├── ∀ (보편양화사, for all)
│   └── ∃ (존재양화사, there exists)
└── 동일성: =

형성규칙:
1. 원자공식: P(t₁, ..., tₙ), t₁=t₂
2. φ가 wff이면 ¬φ도 wff
3. φ, ψ가 wff이면 (φ∧ψ), (φ∨ψ), (φ→ψ)도 wff
4. φ가 wff이고 x가 변항이면 ∀xφ, ∃xφ도 wff
```

### 양화사 규칙
```
∀-도입: φ(a) ⊢ ∀xφ(x) [a는 임의의 상항]
∀-제거: ∀xφ(x) ⊢ φ(t) [t는 임의의 항]

∃-도입: φ(t) ⊢ ∃xφ(x)
∃-제거: ∃xφ(x), [φ(a)]...ψ ⊢ ψ [a 새로운 상항]

동일성 규칙:
=-도입: ⊢ t=t (반사성)
=-제거: t₁=t₂, φ(t₁) ⊢ φ(t₂) (대입)
```

### 모형론적 의미론
```
구조 M = ⟨D, I⟩:
- D: 논의영역 (Domain)
- I: 해석함수 (Interpretation)

만족 (Satisfaction):
M ⊨ P(a) iff I(a) ∈ I(P)
M ⊨ ∀xφ(x) iff 모든 d∈D에 대해 M ⊨ φ[d/x]
M ⊨ ∃xφ(x) iff 어떤 d∈D에 대해 M ⊨ φ[d/x]

타당성과 충족가능성:
- ⊨ φ (타당): 모든 구조에서 참
- φ가 충족가능: 어떤 구조에서 참
```

## 4. 양상논리학 (Modal Logic)

### 기본 양상논리
```
양상연산자:
□ (필연성, Necessity): "반드시 ~이다"
◇ (가능성, Possibility): "~일 수 있다"

상호정의:
□φ ≡ ¬◇¬φ
◇φ ≡ ¬□¬φ

공리체계:
K: □(φ→ψ) → (□φ→□ψ) [분배공리]
T: □φ → φ [반사성]
4: □φ → □□φ [추이성]
5: ◇φ → □◇φ [유클리드성]
B: φ → □◇φ [대칭성]
```

### Kripke 의미론 (가능세계 의미론)
```
Kripke 구조 K = ⟨W, R, V⟩:
- W: 가능세계들의 집합
- R: 접근가능성 관계 (Accessibility Relation)
- V: 진리치 할당

만족:
K, w ⊨ □φ iff 모든 w'(wRw' → K,w' ⊨ φ)
K, w ⊨ ◇φ iff 어떤 w'(wRw' ∧ K,w' ⊨ φ)

체계와 프레임 조건:
K: 무조건
T: 반사적 (∀w. wRw)
S4: 반사적 + 추이적
S5: 동치관계 (반사적 + 대칭적 + 추이적)
```

### 응용 양상논리
```
인식논리학 (Epistemic Logic):
Kₐφ: 행위자 a가 φ임을 안다
Bₐφ: 행위자 a가 φ라고 믿는다

의무논리학 (Deontic Logic):
Oφ: φ해야 한다 (의무)
Pφ: φ해도 된다 (허용)
Fφ: φ해서는 안 된다 (금지)

시제논리학 (Temporal Logic):
Gφ: 항상 φ일 것이다 (always)
Fφ: 언젠가 φ일 것이다 (eventually)
Hφ: 항상 φ였다 (always in past)
Pφ: 언젠가 φ였다 (sometime in past)
```

## 5. 메타논리학 (Metalogic)

### Gödel 불완전성 정리
```
제1불완전성 정리 (1931):
충분히 강한 형식체계 T가 일관적이면,
T에서 증명도 반증도 불가능한 명제 G가 존재한다.

G: "이 명제는 T에서 증명불가능하다"

제2불완전성 정리:
일관적인 체계 T는 자신의 일관성을 증명할 수 없다.

함의:
- 수학의 완전한 형식화 불가능
- 힐베르트 프로그램의 한계
- 결정불가능성 (undecidability)
```

### Tarski 진리론
```
진리의 의미론적 정의:
"Snow is white" is true iff snow is white

T-도식 (T-schema):
True(⌜φ⌝) ↔ φ

거짓말쟁이 역설 회피:
- 대상언어 vs 메타언어 구분
- 진리술어는 메타언어에만 적용
- 언어 계층 (language hierarchy)
```

### 완전성과 건전성
```
건전성 (Soundness):
Γ ⊢ φ → Γ ⊨ φ
(증명가능하면 타당하다)

완전성 (Completeness):
Γ ⊨ φ → Γ ⊢ φ
(타당하면 증명가능하다)

Gödel 완전성 정리 (1929):
1차 술어논리는 완전하다.

결정가능성:
- 명제논리: 결정가능 (진리표)
- 1차 논리: 반결정가능 (semi-decidable)
- 2차 논리: 불완전, 비결정적
```

## 6. 비형식논리학과 논증이론

### Toulmin 논증 모형
```
구성요소:
├── Claim (주장): 입증하려는 결론
├── Data (자료): 주장의 근거
├── Warrant (보증): 자료가 주장을 지지하는 이유
├── Backing (뒷받침): 보증을 지지하는 배경
├── Qualifier (한정어): 주장의 강도 조절
└── Rebuttal (반박): 예외 조건

적용:
"흡연은 건강에 해롭다(C)
왜냐하면 연구에 따르면 폐암 발생률이 높아지기 때문이다(D)
건강에 해로운 요인은 피해야 한다(W)
의학적 연구가 이를 뒷받침한다(B)
대부분의 경우(Q)
특별한 유전적 요인이 없다면(R)"
```

### 오류론 (Theory of Fallacies)
```
형식적 오류:
├── 전건부정 (Denying the Antecedent)
│   p→q, ¬p ∴ ¬q (무효)
├── 후건긍정 (Affirming the Consequent)
│   p→q, q ∴ p (무효)
└── 매개념 부주연 (Undistributed Middle)

비형식적 오류:
├── 관련성 오류
│   ├── 인신공격 (Ad Hominem)
│   ├── 권위에 호소 (Appeal to Authority)
│   ├── 감정에 호소 (Appeal to Emotion)
│   └── 허수아비 논증 (Straw Man)
│
├── 모호성 오류
│   ├── 애매어 (Equivocation)
│   ├── 합성의 오류 (Composition)
│   └── 분해의 오류 (Division)
│
└── 가정 오류
    ├── 선결문제 요구 (Begging the Question)
    ├── 복합질문 (Complex Question)
    └── 잘못된 이분법 (False Dichotomy)
```

### 비판적 사고 프레임워크
```
Paul-Elder 모형:

사고의 요소:
1. 목적 (Purpose)
2. 질문 (Question)
3. 정보 (Information)
4. 해석 (Interpretation)
5. 개념 (Concepts)
6. 가정 (Assumptions)
7. 함의 (Implications)
8. 관점 (Point of View)

지적 표준:
- 명확성 (Clarity)
- 정확성 (Accuracy)
- 정밀성 (Precision)
- 관련성 (Relevance)
- 깊이 (Depth)
- 넓이 (Breadth)
- 논리성 (Logic)
- 중요성 (Significance)
- 공정성 (Fairness)
```

## 7. 질적연구에서 논리학 적용

### 귀추법 (Abduction)
```
Peirce의 귀추:
놀라운 사실 C가 관찰된다.
그러나 A가 참이라면 C는 당연하다.
그러므로 A가 참이라고 생각할 이유가 있다.

질적연구 적용:
- Grounded Theory의 이론적 표집
- 최선의 설명으로의 추론 (IBE)
- 가설 생성의 논리

귀납/연역과 비교:
연역: 규칙 → 사례 → 결과
귀납: 사례 → 결과 → 규칙
귀추: 규칙 → 결과 → 사례
```

### 논증 분석 방법론
```
Pragma-Dialectics (van Eemeren):

비판적 토론 규칙:
1. 자유 규칙: 표현 방해 금지
2. 입증 책임 규칙: 도전받으면 방어
3. 입장 규칙: 실제 입장만 공격
4. 관련성 규칙: 관련된 논증만
5. 암묵적 전제 규칙: 묵시적 전제 존중
6. 출발점 규칙: 공유 전제에서 시작
7. 논증도식 규칙: 유효한 도식 사용
8. 타당성 규칙: 형식적으로 타당
9. 종결 규칙: 실패 시 철회, 성공 시 양보
10. 언어 사용 규칙: 명확하게 표현

분석 절차:
1. 논쟁 재구성
2. 논증 구조 도식화
3. 규칙 위반 식별
4. 평가 및 해석
```

## 8. 주요 저널과 출판

### 논리학 저널
```
최상위:
- Journal of Symbolic Logic
- Journal of Philosophical Logic
- Review of Symbolic Logic
- Notre Dame Journal of Formal Logic

비형식논리:
- Argumentation
- Informal Logic
- Cogency
```

### 핵심 참고문헌
```
입문서:
- Copi, I. M. (2014). Introduction to Logic (14th ed.)
- Hurley, P. J. (2015). A Concise Introduction to Logic

중급:
- van Dalen, D. (2013). Logic and Structure
- Enderton, H. B. (2001). A Mathematical Introduction to Logic

고급:
- Boolos, G., Burgess, J., & Jeffrey, R. (2007). Computability and Logic
- Barwise, J., & Etchemendy, J. (1999). Language, Proof and Logic

철학적 논리:
- Hughes, G. E., & Cresswell, M. J. (1996). A New Introduction to Modal Logic
- Fitting, M., & Mendelsohn, R. L. (1998). First-Order Modal Logic
```
