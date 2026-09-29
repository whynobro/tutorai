import { describe, expect, it } from "vitest";
import { checkSuccessSchema } from "./check.js";

describe("binary public response", () => {
  it("accepts only correct or incorrect", () => {
    expect(checkSuccessSchema.parse({ result: "correct" })).toEqual({
      result: "correct",
    });
    expect(checkSuccessSchema.parse({ result: "incorrect" })).toEqual({
      result: "incorrect",
    });
  });

  it("rejects answer-bearing fields", () => {
    expect(() =>
      checkSuccessSchema.parse({
        result: "incorrect",
        correctChoiceId: "b",
      }),
    ).toThrow();
    expect(() =>
      checkSuccessSchema.parse({
        result: "incorrect",
        explanation: "The answer is B",
      }),
    ).toThrow();
  });
});

