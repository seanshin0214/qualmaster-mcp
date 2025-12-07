import { ChromaClient, Collection, DefaultEmbeddingFunction } from "chromadb";
import { COLLECTIONS } from "./collections.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let chromaClient: ChromaClient | null = null;
let embeddingFunction: DefaultEmbeddingFunction | null = null;
let isChromaAvailable = false;

// 프로젝트 루트의 chroma-data 폴더 경로
const CHROMA_DATA_PATH = path.resolve(__dirname, "../../chroma-data");

export async function initializeDatabase(): Promise<void> {
  // ChromaDB JavaScript 클라이언트는 HTTP 서버가 필요합니다.
  // Windows에서 서버 실행이 어려우므로, 로컬 파일 검색을 사용합니다.
  // ChromaDB를 사용하려면 HTTP 서버를 별도로 실행해야 합니다:
  // chroma run --path ./chroma-data --port 8000

  const chromaUrl = process.env.CHROMA_URL;

  if (chromaUrl) {
    try {
      embeddingFunction = new DefaultEmbeddingFunction();
      chromaClient = new ChromaClient({ path: chromaUrl });

      // Test connection
      await chromaClient.heartbeat();

      // Ensure all collections exist
      for (const collectionConfig of Object.values(COLLECTIONS)) {
        try {
          await chromaClient.getOrCreateCollection({
            name: collectionConfig.name,
            metadata: collectionConfig.metadata,
            embeddingFunction: embeddingFunction,
          });
        } catch (error) {
          // Collection creation failed, but continue
        }
      }

      isChromaAvailable = true;
      console.error(`ChromaDB initialized (HTTP mode): ${chromaUrl}`);
      return;
    } catch (error) {
      console.error("ChromaDB connection failed, using local file search");
    }
  }

  // ChromaDB 없이 로컬 파일 검색 사용
  isChromaAvailable = false;
  console.error("Using local file-based search (ChromaDB disabled)");
}

export function isVectorSearchAvailable(): boolean {
  return isChromaAvailable;
}

export function getChromaClient(): ChromaClient | null {
  return chromaClient;
}

export async function getCollection(name: string): Promise<Collection | null> {
  if (!chromaClient || !embeddingFunction || !isChromaAvailable) {
    return null;
  }
  try {
    return await chromaClient.getCollection({ name, embeddingFunction });
  } catch {
    return null;
  }
}
