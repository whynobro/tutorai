import {
  checkFailureSchema,
  checkRequestSchema,
  checkSuccessSchema,
  type CheckFailureReason,
} from "@tutorai/contracts";
import type { FastifyInstance } from "fastify";
import type { ImageChecker, InternalAnalysis } from "../lib/openai.js";

export async function registerCheckRoute(
  app: FastifyInstance,
  options: { checker: ImageChecker; confidenceThreshold: number },
) {
  app.post("/v1/check", async (request, reply) => {
    const parsed = checkRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: { reason: "unsupported" } });
    }

    const analysis = await options.checker.analyze(parsed.data.imageDataUrl);
    const failure = mapFailure(analysis, options.confidenceThreshold);
    if (failure) {
      return reply.code(422).send(
        checkFailureSchema.parse({
          error: { reason: failure },
        }),
      );
    }

    return reply.send(checkSuccessSchema.parse({ result: analysis.result }));
  });
}

function mapFailure(
  analysis: InternalAnalysis,
  confidenceThreshold: number,
): CheckFailureReason | null {
  if (analysis.status === "no_selection") return "no_selection";
  if (analysis.status === "unsupported") return "unsupported";
  if (
    analysis.status === "unreadable" ||
    analysis.confidence < confidenceThreshold ||
    analysis.result === "unknown"
  ) {
    return "unreadable";
  }
  return null;
}

