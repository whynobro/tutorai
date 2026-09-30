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

    const modelAnalysis = await options.checker.analyze(parsed.data.imageDataUrl);
    const listedChoices = new Set(modelAnalysis.choices.map(normalizeChoice));
    const selectedChoiceListed =
      modelAnalysis.selectedChoice !== null &&
      listedChoices.has(normalizeChoice(modelAnalysis.selectedChoice));
    const canonicalAnswerListed =
      modelAnalysis.canonicalAnswer !== null &&
      listedChoices.has(normalizeChoice(modelAnalysis.canonicalAnswer));
    const comparison =
      modelAnalysis.status === "answer_selected" &&
      selectedChoiceListed &&
      canonicalAnswerListed
        ? normalizeChoice(modelAnalysis.selectedChoice!) ===
          normalizeChoice(modelAnalysis.canonicalAnswer!)
        : null;
    const inconsistent =
      comparison !== null &&
      modelAnalysis.result !== (comparison ? "correct" : "incorrect");
    const analysis: InternalAnalysis =
      modelAnalysis.status === "answer_selected" &&
      (comparison === null || inconsistent)
        ? { ...modelAnalysis, status: "unreadable", result: "unknown" }
        : comparison === null
          ? modelAnalysis
          : { ...modelAnalysis, result: comparison ? "correct" : "incorrect" };
    request.log.info(
      {
        status: analysis.status,
        result: analysis.result,
        modelResult: modelAnalysis.result,
        confidence: analysis.confidence,
        selectedChoiceListed,
        canonicalAnswerListed,
        choicesAgreeWithResult:
          comparison === null ? null : !inconsistent,
      },
      "Answer check analysis",
    );
    const failure = mapFailure(analysis, options.confidenceThreshold);
    if (failure) {
      return reply.code(422).send(
        checkFailureSchema.parse({
          error: { reason: failure },
        }),
      );
    }

    return reply.send(
      checkSuccessSchema.parse({
        result: analysis.result,
        correctAnswer: analysis.canonicalAnswer,
      }),
    );
  });
}

function normalizeChoice(choice: string): string {
  return choice.trim().replace(/\s+/g, " ").toLocaleLowerCase();
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

