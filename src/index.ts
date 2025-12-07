import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { registerTools } from "./tools/index.js";
import { initializeDatabase } from "./db/client.js";
import { loadKnowledgeBase, getKnowledgeStats } from "./db/localSearch.js";
import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.join(__dirname, "../skills");

async function main() {
  // Initialize ChromaDB (optional - might fail)
  await initializeDatabase();

  // Load local knowledge base (fallback)
  await loadKnowledgeBase();
  const stats = getKnowledgeStats();
  console.error(`[LocalSearch] Knowledge base ready: ${stats.total} documents`);

  // Create MCP Server
  const server = new Server(
    {
      name: "qualmaster-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},  // Enable Resources for Skills
      },
    }
  );

  // Register all tools
  registerTools(server);

  // List available resources (Skills)
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    if (!existsSync(SKILLS_DIR)) {
      return { resources: [] };
    }

    const files = readdirSync(SKILLS_DIR)
      .filter((f) => f.endsWith(".md"))
      .sort();

    const resources = files.map((file) => {
      const name = file.replace(".md", "").replace(/_/g, " ");
      return {
        uri: `qualmaster://skills/${file}`,
        name: `QualMaster: ${name}`,
        description: `Dr. QualMaster ${name} expertise`,
        mimeType: "text/markdown",
      };
    });

    return { resources };
  });

  // Read resource content
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;
    const filename = uri.replace("qualmaster://skills/", "");
    const filepath = path.join(SKILLS_DIR, filename);

    if (!existsSync(filepath)) {
      throw new Error(`Skill not found: ${filename}`);
    }

    const content = readFileSync(filepath, "utf-8");

    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Dr. QualMaster MCP Server running on stdio");
  console.error(`Skills loaded from: ${SKILLS_DIR}`);
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
