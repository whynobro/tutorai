import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join, relative } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

interface ReferenceChunk {
  source: string;
  page: number;
  text: string;
  terms: Set<string>;
}

export interface CourseReferences {
  search(query: string): string[];
  documentCount: number;
  chunkCount: number;
}

const chunkSize = 1_100;
const chunkOverlap = 160;
const maxResults = 5;

export async function loadCourseReferences(
  rootDir: string | undefined,
): Promise<CourseReferences> {
  if (!rootDir?.trim()) return emptyReferences();

  const files = await findPdfs(rootDir.trim());
  const chunks: ReferenceChunk[] = [];
  let documentCount = 0;

  for (const filePath of files) {
    try {
      const data = new Uint8Array(await readFile(filePath));
      const pdf = await getDocument({
        data,
        disableFontFace: true,
        verbosity: 0,
      }).promise;
      const source = relative(rootDir, filePath) || basename(filePath);
      let addedFromDocument = false;

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter((item): item is typeof item & { str: string } => "str" in item)
          .map((item) => item.str)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        for (const text of splitIntoChunks(pageText)) {
          chunks.push({
            source,
            page: pageNumber,
            text,
            terms: new Set(tokenize(text)),
          });
          addedFromDocument = true;
        }
      }

      if (addedFromDocument) documentCount += 1;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      process.stderr.write(`TutorAI could not read course reference ${filePath}: ${reason}\n`);
    }
  }

  const documentFrequency = new Map<string, number>();
  for (const chunk of chunks) {
    for (const term of chunk.terms) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  return {
    documentCount,
    chunkCount: chunks.length,
    search(query) {
      const queryTerms = new Set(tokenize(query));
      if (queryTerms.size === 0 || chunks.length === 0) return [];

      const ranked = chunks
        .map((chunk) => {
          let score = 0;
          for (const term of queryTerms) {
            if (chunk.terms.has(term)) {
              score += Math.log(1 + chunks.length / (documentFrequency.get(term) ?? 1));
            }
          }
          return { chunk, score };
        })
        .filter(({ score }) => score > 0)
        .sort((left, right) => right.score - left.score);

      const selected: typeof ranked = [];
      const pageCounts = new Map<string, number>();
      for (const result of ranked) {
        const pageKey = `${result.chunk.source}:${result.chunk.page}`;
        const pageCount = pageCounts.get(pageKey) ?? 0;
        if (pageCount >= 2) continue;
        selected.push(result);
        pageCounts.set(pageKey, pageCount + 1);
        if (selected.length >= maxResults) break;
      }

      return selected.map(
        ({ chunk }) => `Source: ${chunk.source}, page ${chunk.page}\n${chunk.text}`,
      );
    },
  };
}

async function findPdfs(rootDir: string): Promise<string[]> {
  const results: string[] = [];
  const entries = await readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(rootDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findPdfs(path)));
    } else if (entry.isFile() && extname(entry.name).toLocaleLowerCase() === ".pdf") {
      results.push(path);
    }
  }
  return results.sort((left, right) => left.localeCompare(right));
}

function splitIntoChunks(text: string): string[] {
  if (!text) return [];
  const chunks: string[] = [];
  for (let start = 0; start < text.length; start += chunkSize - chunkOverlap) {
    const part = text.slice(start, start + chunkSize).trim();
    if (part) chunks.push(part);
  }
  return chunks;
}

function tokenize(text: string): string[] {
  return text
    .toLocaleLowerCase()
    .match(/[\p{L}\p{N}]+(?:[.+-][\p{L}\p{N}]+)*/gu) ?? [];
}

function emptyReferences(): CourseReferences {
  return {
    documentCount: 0,
    chunkCount: 0,
    search: () => [],
  };
}
