# Dr. QualMaster MCP Server

> AI-Powered Qualitative Research & Conceptual Paper Writing Assistant

[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-RAG-green)](https://www.trychroma.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Dr. QualMaster는 질적연구자와 개념논문 작성자를 위한 전문 MCP(Model Context Protocol) 서버입니다. 심층적인 방법론 지식과 AI 기반 분석 도구를 결합하여 연구 전 과정을 지원합니다.

### Key Features

- **12개 전문 MCP Tools** - 연구 지원을 위한 특화 도구
- **RAG 기반 Knowledge Base** - ChromaDB 벡터 검색
- **다중 패러다임 지원** - 실증주의, 후기실증주의, 비판이론, 구성주의
- **5대 질적연구 전통** - 현상학, 근거이론, 문화기술지, 내러티브, 사례연구
- **저널별 가이드** - AMR, ASQ 스타일 가이드
- **R&R 전략 지원** - 리젝션 패턴 진단 및 수정 가이드

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude Desktop                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Skills (Hot Layer)                      │    │
│  │  - Identity & Persona (Dr. QualMaster)              │    │
│  │  - Paradigm Deep Knowledge                          │    │
│  │  - Methodology Guidelines                           │    │
│  │  - Journal Requirements                             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                       MCP Protocol
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              QualMaster MCP Server (Cold Layer)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   12 Tools   │  │   ChromaDB   │  │  Knowledge   │      │
│  │              │  │    (RAG)     │  │    Base      │      │
│  │ - search     │  │              │  │              │      │
│  │ - analyze    │  │ - paradigms  │  │ - 22+ MD     │      │
│  │ - assess     │  │ - methods    │  │   files      │      │
│  │ - guide      │  │ - journals   │  │ - cases      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Claude Desktop

### Setup

```bash
# Clone the repository
git clone https://github.com/seanshin0214/qualmaster-mcp.git
cd qualmaster-mcp

# Install dependencies
npm install

# Build
npm run build

# (Optional) Seed the knowledge base
npm run seed
```

### Claude Desktop Configuration

`claude_desktop_config.json`에 추가:

```json
{
  "mcpServers": {
    "qualmaster": {
      "command": "node",
      "args": [
        "C:\\path\\to\\qualmaster-mcp-server\\dist\\index.js"
      ],
      "env": {
        "CHROMA_PATH": "C:\\path\\to\\qualmaster-mcp-server\\chroma-data"
      }
    }
  }
}
```

## MCP Tools (12개)

### Knowledge & Methodology (지식 & 방법론)

| Tool | Description |
|------|-------------|
| `search_knowledge` | RAG 기반 지식베이스 검색 (패러다임, 방법론, 저널) |
| `get_methodology` | 특정 방법론 상세 가이드 |
| `suggest_methodology` | 연구질문 기반 방법론 추천 |

### Data Analysis (데이터 분석)

| Tool | Description |
|------|-------------|
| `auto_coding` | AI 지원 질적 코딩 |
| `extract_themes` | 코딩 데이터에서 주제 추출 |
| `detect_saturation` | 이론적 포화 탐지 |
| `assess_quality` | 품질 평가 (신뢰성, 전이가능성 등) |

### Conceptual Paper Writing (개념논문 작성)

| Tool | Description |
|------|-------------|
| `conceptualize_idea` | 연구 아이디어를 개념으로 발전 |
| `develop_proposition` | 이론적 명제 개발 |
| `review_paper` | 투고 전 논문 리뷰 |

### R&R Support (수정재제출 지원)

| Tool | Description |
|------|-------------|
| `diagnose_rejection` | 리젝션 패턴 분석 (So What?, Old Wine 등) |
| `guide_revision` | 전략적 수정 가이드 |

## Knowledge Base Structure

```
src/knowledge/
├── paradigms/           # 연구 패러다임
│   ├── positivism_deep.md
│   ├── postpositivism_deep.md
│   ├── critical_theory_deep.md
│   └── constructivism_deep.md
├── traditions/          # 방법론적 전통
│   ├── phenomenology/
│   │   ├── husserlian.md      # 후설 현상학
│   │   └── heideggerian.md    # 하이데거 해석학적 현상학
│   ├── grounded_theory/
│   │   ├── glaserian.md       # 글레이저 GT
│   │   ├── charmaz.md         # 샤마즈 구성주의 GT
│   │   └── ipa.md             # 해석학적 현상학적 분석
│   ├── ethnography/
│   │   └── classical.md
│   ├── narrative/
│   │   └── life_history.md
│   └── case_study/
│       └── yin.md             # Yin의 사례연구
├── methods/            # 분석 방법
│   ├── coding/
│   │   ├── types.md           # 코딩 유형
│   │   ├── strategies.md      # 코딩 전략
│   │   └── thematic.md        # 주제 분석
│   └── quality/
│       └── trustworthiness.md # 신뢰성 기준
├── journals/           # 저널 가이드
│   ├── amr.md                 # Academy of Management Review
│   └── asq.md                 # Administrative Science Quarterly
├── exemplars/          # 모범 논문
│   ├── edmondson_psych_safety.md
│   ├── march_exploration.md
│   └── weick_sensemaking.md
└── cases/              # R&R 사례
    ├── rejection_cases/
    │   ├── so_what_case.md
    │   ├── old_wine_case.md
    │   └── logic_gap_case.md
    └── success_cases/
        └── rr_success_1.md
```

## Skills (Hot Layer)

`skills/` 폴더의 10개 스킬 파일 (Claude Desktop 프로젝트에 첨부):

| # | File | Description |
|---|------|-------------|
| 1 | `01_IDENTITY.md` | Dr. QualMaster 페르소나 정의 |
| 2 | `02_PARADIGMS.md` | 연구 패러다임 전문 지식 |
| 3 | `03_TRADITIONS.md` | 5대 질적연구 전통 |
| 4 | `04_CODING.md` | 질적 코딩 마스터리 |
| 5 | `05_QUALITY.md` | 신뢰성 기준 (Trustworthiness) |
| 6 | `06_JOURNALS.md` | 저널 투고 요건 |
| 7 | `07_CONCEPTUAL.md` | 개념논문 작성법 |
| 8 | `08_RR.md` | R&R 전략 |
| 9 | `09_ETHICS.md` | 연구 윤리 |
| 10 | `10_TOOLS_AI.md` | AI 도구 통합 가이드 |

## Development

```bash
# Development mode (watch)
npm run dev

# Build
npm run build

# Seed knowledge base to ChromaDB
npm run seed

# Test tools
npm run test:tools
```

## Project Structure

```
qualmaster-mcp-server/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── db/
│   │   ├── client.ts      # ChromaDB client
│   │   ├── collections.ts # Collection definitions
│   │   └── embeddings.ts  # Search functions
│   ├── tools/             # 12 MCP tools
│   │   ├── index.ts
│   │   ├── searchKnowledge.ts
│   │   ├── getMethodology.ts
│   │   ├── suggestMethodology.ts
│   │   ├── autoCoding.ts
│   │   ├── extractThemes.ts
│   │   ├── detectSaturation.ts
│   │   ├── assessQuality.ts
│   │   ├── conceptualizeIdea.ts
│   │   ├── developProposition.ts
│   │   ├── reviewPaper.ts
│   │   ├── diagnoseRejection.ts
│   │   └── guideRevision.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── prompts.ts
│   └── knowledge/         # Knowledge base (MD files)
├── skills/                # Claude Desktop skills (10 files)
├── scripts/
│   ├── seed-db.ts        # Database seeding script
│   └── test-tools.ts     # Tool testing script
├── dist/                  # Compiled JavaScript
├── chroma-data/          # Vector database storage
├── package.json
├── tsconfig.json
└── .env.example
```

## Environment Variables

```bash
# .env
CHROMA_PATH=./chroma-data
LOG_LEVEL=info
```

## Supported Methodologies

### Paradigms
- Positivism (실증주의)
- Post-positivism (후기실증주의)
- Critical Theory (비판이론)
- Constructivism (구성주의)

### Qualitative Traditions
- **Phenomenology** - Husserlian, Heideggerian, IPA
- **Grounded Theory** - Glaserian, Straussian, Charmaz
- **Ethnography** - Classical, Autoethnography
- **Narrative Inquiry** - Life History, Oral History
- **Case Study** - Yin's approach, Multiple case

### Analysis Methods
- Open/Axial/Selective Coding
- Thematic Analysis (Braun & Clarke)
- Constant Comparative Method
- Pattern Matching

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Sean Shin** - Qualitative Research & AI Integration

## Acknowledgments

- Model Context Protocol (Anthropic)
- ChromaDB Team
- Qualitative Research Community

---

*Built with dedication for qualitative researchers worldwide*
