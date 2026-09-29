import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import type { ImageChecker, InternalAnalysis } from "./lib/openai.js";

const requestBody = {
  imageDataUrl: `data:image/png;base64,${Buffer.from("fixture").toString("base64")}`,
  viewport: { width: 1280, height: 720, devicePixelRatio: 1 },
};

function checkerWith(analysis: InternalAnalysis): ImageChecker {
  return { analyze: async () => analysis };
}

describe("POST /v1/check", () => {
  it("returns only the binary result", async () => {
    const app = await createApp({
      checker: checkerWith({
        status: "answer_selected",
        question: "2 + 2?",
        choices: ["3", "4"],
        selectedChoice: "4",
        canonicalAnswer: "4",
        result: "correct",
        confidence: 0.99,
      }),
    });

    const response = await app.inject({ method: "POST", url: "/v1/check", payload: requestBody });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ result: "correct" });
    await app.close();
  });

  it("separates no selection from an incorrect answer", async () => {
    const app = await createApp({
      checker: checkerWith({
        status: "no_selection",
        question: "2 + 2?",
        choices: ["3", "4"],
        selectedChoice: null,
        canonicalAnswer: "4",
        result: "unknown",
        confidence: 0.99,
      }),
    });

    const response = await app.inject({ method: "POST", url: "/v1/check", payload: requestBody });
    expect(response.statusCode).toBe(422);
    expect(response.json()).toEqual({ error: { reason: "no_selection" } });
    await app.close();
  });

  it("refuses low-confidence binary output", async () => {
    const app = await createApp({
      checker: checkerWith({
        status: "answer_selected",
        question: "Unclear",
        choices: ["A", "B"],
        selectedChoice: "A",
        canonicalAnswer: "B",
        result: "incorrect",
        confidence: 0.4,
      }),
    });

    const response = await app.inject({ method: "POST", url: "/v1/check", payload: requestBody });
    expect(response.statusCode).toBe(422);
    expect(response.json()).toEqual({ error: { reason: "unreadable" } });
    await app.close();
  });
});

