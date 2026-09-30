import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";
import { loadCourseReferences } from "./lib/course-references.js";
import { createOpenAIImageChecker } from "./lib/openai.js";

// npm workspaces run this from apps/api, so resolve the repo-root .env explicitly.
config({ path: fileURLToPath(new URL("../../../.env", import.meta.url)), quiet: true });

const port = Number(process.env.PORT ?? 8787);
const confidenceThreshold = Number(process.env.CHECK_CONFIDENCE_THRESHOLD ?? 0.8);
const courseReferenceDir = process.env.COURSE_REFERENCE_DIR;
let references: Awaited<ReturnType<typeof loadCourseReferences>>;
try {
  references = await loadCourseReferences(courseReferenceDir);
  if (courseReferenceDir) {
    process.stdout.write(
      `Loaded ${references.documentCount} course reference PDF(s) from ${courseReferenceDir} (${references.chunkCount} text passages).\n`,
    );
  }
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  process.stderr.write(`TutorAI could not load course references: ${reason}\n`);
  references = await loadCourseReferences(undefined);
}

const checker = createOpenAIImageChecker({ references, confidenceThreshold });
const app = await createApp({ checker, confidenceThreshold });

await app.listen({ host: "127.0.0.1", port });

