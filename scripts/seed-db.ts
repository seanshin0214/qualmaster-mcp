/**
 * ChromaDB Seeding Script for Dr. QualMaster MCP Server
 *
 * Usage: npm run seed
 *
 * This script reads all markdown files from src/knowledge/ and
 * seeds them into ChromaDB collections for RAG retrieval.
 */

import { ChromaClient } from "chromadb";
import { readdir, readFile } from "fs/promises";
import { join, basename, dirname } from "path";
import dotenv from "dotenv";

dotenv.config();

const CHROMA_PATH = process.env.CHROMA_PATH || "./chroma-data";
const KNOWLEDGE_PATH = "./src/knowledge";

interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    category: string;
    subcategory: string;
    title: string;
  };
}

// Collection definitions
const COLLECTIONS = {
  paradigms: "qualmaster_paradigms",
  traditions: "qualmaster_traditions",
  methods: "qualmaster_methods",
  journals: "qualmaster_journals",
  exemplars: "qualmaster_exemplars",
  cases: "qualmaster_cases",
};

/**
 * Recursively find all markdown files in a directory
 */
async function findMarkdownFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function scan(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  }

  await scan(dir);
  return files;
}

/**
 * Split markdown content into chunks
 */
function splitIntoChunks(content: string, maxChunkSize: number = 1000): string[] {
  const chunks: string[] = [];

  // Split by headers first
  const sections = content.split(/(?=^#{1,3}\s)/m);

  for (const section of sections) {
    if (section.trim().length === 0) continue;

    if (section.length <= maxChunkSize) {
      chunks.push(section.trim());
    } else {
      // Further split large sections by paragraphs
      const paragraphs = section.split(/\n\n+/);
      let currentChunk = "";

      for (const para of paragraphs) {
        if ((currentChunk + para).length <= maxChunkSize) {
          currentChunk += (currentChunk ? "\n\n" : "") + para;
        } else {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = para;
        }
      }

      if (currentChunk) chunks.push(currentChunk.trim());
    }
  }

  return chunks.filter(c => c.length > 50); // Filter very small chunks
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : "Untitled";
}

/**
 * Determine collection name from file path
 */
function getCollectionFromPath(filePath: string): string {
  const relativePath = filePath.replace(KNOWLEDGE_PATH, "").replace(/\\/g, "/");
  const parts = relativePath.split("/").filter(Boolean);

  if (parts.length > 0) {
    const category = parts[0];
    if (category in COLLECTIONS) {
      return COLLECTIONS[category as keyof typeof COLLECTIONS];
    }
  }

  return COLLECTIONS.methods; // Default
}

/**
 * Get category and subcategory from file path
 */
function getCategoriesFromPath(filePath: string): { category: string; subcategory: string } {
  const relativePath = filePath.replace(KNOWLEDGE_PATH, "").replace(/\\/g, "/");
  const parts = relativePath.split("/").filter(Boolean);

  return {
    category: parts[0] || "general",
    subcategory: parts.length > 1 ? parts.slice(1, -1).join("/") : "",
  };
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log("🚀 Starting Dr. QualMaster Knowledge Base Seeding...\n");

  // Initialize ChromaDB client
  const client = new ChromaClient({ path: CHROMA_PATH });
  console.log(`📁 ChromaDB path: ${CHROMA_PATH}`);

  // Delete existing collections
  console.log("\n🗑️  Cleaning up existing collections...");
  for (const collectionName of Object.values(COLLECTIONS)) {
    try {
      await client.deleteCollection({ name: collectionName });
      console.log(`   Deleted: ${collectionName}`);
    } catch {
      // Collection might not exist
    }
  }

  // Create collections
  console.log("\n📦 Creating collections...");
  const collections: Record<string, Awaited<ReturnType<typeof client.createCollection>>> = {};

  for (const [key, name] of Object.entries(COLLECTIONS)) {
    collections[name] = await client.createCollection({
      name,
      metadata: { description: `Dr. QualMaster - ${key}` },
    });
    console.log(`   Created: ${name}`);
  }

  // Find all markdown files
  console.log("\n📄 Finding markdown files...");
  const mdFiles = await findMarkdownFiles(KNOWLEDGE_PATH);
  console.log(`   Found ${mdFiles.length} files`);

  // Process each file
  console.log("\n⚙️  Processing files...\n");
  let totalChunks = 0;
  const stats: Record<string, number> = {};

  for (const filePath of mdFiles) {
    const content = await readFile(filePath, "utf-8");
    const title = extractTitle(content);
    const collectionName = getCollectionFromPath(filePath);
    const { category, subcategory } = getCategoriesFromPath(filePath);
    const chunks = splitIntoChunks(content);

    if (!stats[collectionName]) stats[collectionName] = 0;
    stats[collectionName] += chunks.length;

    const documents: DocumentChunk[] = chunks.map((chunk, index) => ({
      id: `${basename(filePath, ".md")}_${index}`,
      content: chunk,
      metadata: {
        source: filePath,
        category,
        subcategory,
        title,
      },
    }));

    // Add to collection
    const collection = collections[collectionName];
    if (collection && documents.length > 0) {
      await collection.add({
        ids: documents.map(d => d.id),
        documents: documents.map(d => d.content),
        metadatas: documents.map(d => d.metadata),
      });

      console.log(`   ✅ ${title} → ${collectionName} (${chunks.length} chunks)`);
      totalChunks += chunks.length;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Seeding Complete!\n");
  console.log("Collection Statistics:");
  for (const [name, count] of Object.entries(stats)) {
    console.log(`   ${name}: ${count} chunks`);
  }
  console.log(`\n   Total: ${totalChunks} chunks across ${mdFiles.length} files`);
  console.log("=".repeat(50));
}

// Run
seedDatabase().catch(console.error);
