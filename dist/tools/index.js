import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { searchKnowledge, searchKnowledgeSchema } from "./searchKnowledge.js";
import { getMethodology, getMethodologySchema } from "./getMethodology.js";
import { suggestMethodology, suggestMethodologySchema } from "./suggestMethodology.js";
import { autoCoding, autoCodingSchema } from "./autoCoding.js";
import { extractThemes, extractThemesSchema } from "./extractThemes.js";
import { detectSaturation, detectSaturationSchema } from "./detectSaturation.js";
import { assessQuality, assessQualitySchema } from "./assessQuality.js";
import { conceptualizeIdea, conceptualizeIdeaSchema } from "./conceptualizeIdea.js";
import { developProposition, developPropositionSchema } from "./developProposition.js";
import { reviewPaper, reviewPaperSchema } from "./reviewPaper.js";
import { diagnoseRejection, diagnoseRejectionSchema } from "./diagnoseRejection.js";
import { guideRevision, guideRevisionSchema } from "./guideRevision.js";
const TOOLS = [
    {
        name: "search_knowledge",
        description: "질적연구 및 컨셉논문 관련 지식베이스를 RAG 검색합니다.",
        inputSchema: searchKnowledgeSchema,
        handler: searchKnowledge,
    },
    {
        name: "get_methodology",
        description: "특정 방법론의 상세 정보를 반환합니다.",
        inputSchema: getMethodologySchema,
        handler: getMethodology,
    },
    {
        name: "suggest_methodology",
        description: "연구 맥락에 맞는 방법론을 추천합니다.",
        inputSchema: suggestMethodologySchema,
        handler: suggestMethodology,
    },
    {
        name: "auto_coding",
        description: "텍스트 데이터에 대한 코딩을 제안합니다.",
        inputSchema: autoCodingSchema,
        handler: autoCoding,
    },
    {
        name: "extract_themes",
        description: "코딩된 데이터에서 주제를 추출합니다.",
        inputSchema: extractThemesSchema,
        handler: extractThemes,
    },
    {
        name: "detect_saturation",
        description: "이론적 포화 수준을 평가합니다.",
        inputSchema: detectSaturationSchema,
        handler: detectSaturation,
    },
    {
        name: "assess_quality",
        description: "질적연구 품질을 Lincoln & Guba 기준으로 평가합니다.",
        inputSchema: assessQualitySchema,
        handler: assessQuality,
    },
    {
        name: "conceptualize_idea",
        description: "아이디어를 학술적 개념으로 발전시킵니다.",
        inputSchema: conceptualizeIdeaSchema,
        handler: conceptualizeIdea,
    },
    {
        name: "develop_proposition",
        description: "이론적 명제를 개발합니다.",
        inputSchema: developPropositionSchema,
        handler: developProposition,
    },
    {
        name: "review_paper",
        description: "컨셉논문 초안을 100점 체크리스트로 평가합니다.",
        inputSchema: reviewPaperSchema,
        handler: reviewPaper,
    },
    {
        name: "diagnose_rejection",
        description: "리젝션 피드백을 분석하고 패턴을 진단합니다.",
        inputSchema: diagnoseRejectionSchema,
        handler: diagnoseRejection,
    },
    {
        name: "guide_revision",
        description: "R&R 대응 전략을 제안합니다.",
        inputSchema: guideRevisionSchema,
        handler: guideRevision,
    },
];
export function registerTools(server) {
    // List available tools
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: TOOLS.map(({ name, description, inputSchema }) => ({
                name,
                description,
                inputSchema,
            })),
        };
    });
    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const tool = TOOLS.find((t) => t.name === name);
        if (!tool) {
            throw new Error(`Unknown tool: ${name}`);
        }
        // Defensive coding: 인자가 없거나 undefined인 경우 빈 객체로 처리
        const safeArgs = (args && typeof args === 'object') ? args : {};
        try {
            const result = await tool.handler(safeArgs);
            return {
                content: [
                    {
                        type: "text",
                        text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${errorMessage}`,
                    },
                ],
                isError: true,
            };
        }
    });
}
//# sourceMappingURL=index.js.map