import type { CheckFailureReason, CheckRequest } from "@tutorai/contracts";

type CaptureResponse =
  | { ok: true; capture: CheckRequest }
  | { ok: false; reason: "network"; detail?: string };

type CheckResponse =
  | { ok: true; result: "correct" | "incorrect"; correctAnswer: string }
  | { ok: false; reason: CheckFailureReason | "network"; detail?: string };

export async function captureVisiblePage(): Promise<CaptureResponse> {
  const raw: unknown = await chrome.runtime.sendMessage({ type: "CAPTURE_VISIBLE_TAB" });

  if (
    typeof raw === "object" &&
    raw !== null &&
    "ok" in raw &&
    raw.ok === false &&
    "error" in raw &&
    typeof raw.error === "string"
  ) {
    return { ok: false, reason: "network", detail: raw.error };
  }

  if (
    typeof raw === "object" &&
    raw !== null &&
    "ok" in raw &&
    raw.ok === true &&
    "capture" in raw &&
    isCapture(raw.capture)
  ) {
    return { ok: true, capture: raw.capture };
  }

  return {
    ok: false,
    reason: "network",
    detail: "The extension service worker did not return a valid screenshot",
  };
}

export async function checkCapture(capture: CheckRequest): Promise<CheckResponse> {
  let raw: unknown;
  try {
    raw = await chrome.runtime.sendMessage({
      type: "CHECK_CAPTURE",
      capture,
    });
  } catch (error) {
    return {
      ok: false,
      reason: "network",
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  if (
    typeof raw === "object" &&
    raw !== null &&
    "ok" in raw &&
    raw.ok === false &&
    "error" in raw &&
    typeof raw.error === "string"
  ) {
    return { ok: false, reason: "network", detail: raw.error };
  }

  if (typeof raw !== "object" || raw === null || !("ok" in raw)) {
    return { ok: false, reason: "network", detail: "No response from the extension service worker" };
  }

  if (raw.ok === true && "body" in raw && isSuccessBody(raw.body)) {
    return {
      ok: true,
      result: raw.body.result,
      correctAnswer: raw.body.correctAnswer,
    };
  }

  if (raw.ok === false && "body" in raw && isFailureBody(raw.body)) {
    return { ok: false, reason: raw.body.error.reason };
  }

  return { ok: false, reason: "network", detail: "The extension service worker returned an unexpected response" };
}

function isCapture(value: unknown): value is CheckRequest {
  if (
    typeof value !== "object" ||
    value === null ||
    !("imageDataUrl" in value) ||
    typeof value.imageDataUrl !== "string" ||
    !value.imageDataUrl.startsWith("data:image/") ||
    !("viewport" in value) ||
    typeof value.viewport !== "object" ||
    value.viewport === null
  ) {
    return false;
  }

  return (
    "width" in value.viewport &&
    typeof value.viewport.width === "number" &&
    "height" in value.viewport &&
    typeof value.viewport.height === "number" &&
    "devicePixelRatio" in value.viewport &&
    typeof value.viewport.devicePixelRatio === "number"
  );
}

function isSuccessBody(
  value: unknown,
): value is { result: "correct" | "incorrect"; correctAnswer: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.keys(value).length === 2 &&
    "result" in value &&
    (value.result === "correct" || value.result === "incorrect") &&
    "correctAnswer" in value &&
    typeof value.correctAnswer === "string" &&
    value.correctAnswer.length > 0
  );
}

function isFailureBody(
  value: unknown,
): value is { error: { reason: CheckFailureReason } } {
  if (
    typeof value !== "object" ||
    value === null ||
    Object.keys(value).length !== 1 ||
    !("error" in value) ||
    typeof value.error !== "object" ||
    value.error === null ||
    Object.keys(value.error).length !== 1 ||
    !("reason" in value.error)
  ) {
    return false;
  }

  return ["no_selection", "unreadable", "unsupported"].includes(
    String(value.error.reason),
  );
}
