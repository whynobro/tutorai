import { z } from "zod";

export const viewportSchema = z.object({
  width: z.number().int().positive().max(10_000),
  height: z.number().int().positive().max(10_000),
  devicePixelRatio: z.number().positive().max(10),
});

export const checkRequestSchema = z.object({
  imageDataUrl: z
    .string()
    .max(8_000_000)
    .regex(/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/),
  viewport: viewportSchema,
});

export const checkSuccessSchema = z
  .object({
    result: z.enum(["correct", "incorrect"]),
  })
  .strict();

export const checkFailureReasonSchema = z.enum([
  "no_selection",
  "unreadable",
  "unsupported",
]);

export const checkFailureSchema = z
  .object({
    error: z
      .object({
        reason: checkFailureReasonSchema,
      })
      .strict(),
  })
  .strict();

export const checkResponseSchema = z.union([
  checkSuccessSchema,
  checkFailureSchema,
]);

export type CheckRequest = z.infer<typeof checkRequestSchema>;
export type CheckSuccess = z.infer<typeof checkSuccessSchema>;
export type CheckFailureReason = z.infer<typeof checkFailureReasonSchema>;
export type CheckFailure = z.infer<typeof checkFailureSchema>;
export type CheckResponse = z.infer<typeof checkResponseSchema>;

