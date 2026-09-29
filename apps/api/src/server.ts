import "dotenv/config";
import { createApp } from "./app.js";
import { createOpenAIImageChecker } from "./lib/openai.js";

const port = Number(process.env.PORT ?? 8787);
const confidenceThreshold = Number(process.env.CHECK_CONFIDENCE_THRESHOLD ?? 0.8);
const checker = createOpenAIImageChecker();
const app = await createApp({ checker, confidenceThreshold });

await app.listen({ host: "127.0.0.1", port });

