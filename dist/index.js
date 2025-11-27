import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";
import { initializeDatabase } from "./db/client.js";
import dotenv from "dotenv";
dotenv.config();
async function main() {
    // Initialize ChromaDB
    await initializeDatabase();
    // Create MCP Server
    const server = new Server({
        name: "qualmaster-mcp-server",
        version: "1.0.0",
    }, {
        capabilities: {
            tools: {},
        },
    });
    // Register all tools
    registerTools(server);
    // Start server with stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Dr. QualMaster MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map