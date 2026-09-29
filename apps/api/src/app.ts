import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import type { ImageChecker } from "./lib/openai.js";
import { registerCheckRoute } from "./routes/check.js";

export async function createApp(options: {
  checker: ImageChecker;
  confidenceThreshold?: number;
}) {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
      redact: ["req.headers.authorization", "req.body.imageDataUrl"],
    },
    bodyLimit: 8_500_000,
  });

  await app.register(cors, {
    origin(origin, callback) {
      if (
        !origin ||
        origin.startsWith("chrome-extension://") ||
        origin.startsWith("edge-extension://") ||
        /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed"), false);
      }
    },
  });

  await app.register(rateLimit, {
    max: 30,
    timeWindow: "1 minute",
  });

  app.get("/health", async () => ({ ok: true }));
  await registerCheckRoute(app, {
    checker: options.checker,
    confidenceThreshold: options.confidenceThreshold ?? 0.8,
  });

  app.setErrorHandler((error, _request, reply) => {
    app.log.error({ err: error }, "Request failed");
    void reply.code(500).send({ error: { reason: "unreadable" } });
  });

  return app;
}

