import OpenAI from "openai";
import { z } from "zod";
import { answerCheckPrompt } from "./prompt.js";

const internalAnalysisSchema = z
  .object({
    status: z.enum(["answer_selected", "no_selection", "unreadable", "unsupported"]),
    question: z.string().nullable(),
    choices: z.array(z.string()),
    selectedChoice: z.string().nullable(),
    canonicalAnswer: z.string().nullable(),
    result: z.enum(["correct", "incorrect", "unknown"]),
    confidence: z.number().min(0).max(1),
  })
  .strict();

export type InternalAnalysis = z.infer<typeof internalAnalysisSchema>;

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "status",
    "question",
    "choices",
    "selectedChoice",
    "canonicalAnswer",
    "result",
    "confidence",
  ],
  properties: {
    status: {
      type: "string",
      enum: ["answer_selected", "no_selection", "unreadable", "unsupported"],
    },
    question: { type: ["string", "null"] },
    choices: { type: "array", items: { type: "string" } },
    selectedChoice: { type: ["string", "null"] },
    canonicalAnswer: { type: ["string", "null"] },
    result: { type: "string", enum: ["correct", "incorrect", "unknown"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
  },
} as const;

export interface ImageChecker {
  analyze(imageDataUrl: string): Promise<InternalAnalysis>;
}

export function createOpenAIImageChecker(options?: {
  apiKey?: string;
  model?: string;
}): ImageChecker {
  const apiKey = options?.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
  }

  const client = new OpenAI({ apiKey });
  const model = options?.model ?? process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  return {
    async analyze(imageDataUrl) {
      const response = await client.responses.create({
        model,
        store: false,
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: answerCheckPrompt },
              { type: "input_image", image_url: imageDataUrl, detail: "high" },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "answer_check",
            strict: true,
            schema: jsonSchema,
          },
        },
      });

      if (!response.output_text) {
        throw new Error("The model returned no structured output");
      }

      return internalAnalysisSchema.parse(JSON.parse(response.output_text));
    },
  };
}

