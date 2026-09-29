import type { CheckRequest } from "@tutorai/contracts";

const API_URL = __TUTOR_API_URL__;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "CAPTURE_VISIBLE_TAB") {
    void captureVisibleTab()
      .then((capture) => sendResponse({ ok: true, capture }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }

  if (message?.type === "CHECK_CAPTURE") {
    void checkCapture(message.capture)
      .then(sendResponse)
      .catch(() =>
        sendResponse({ ok: false, body: { error: { reason: "unreadable" } } }),
      );
    return true;
  }

  return false;
});

async function captureVisibleTab(): Promise<CheckRequest> {
  const imageDataUrl = await chrome.tabs.captureVisibleTab({
    format: "jpeg",
    quality: 82,
  });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const viewport = await readViewport(tab?.id);
  return { imageDataUrl, viewport };
}

async function checkCapture(value: unknown): Promise<unknown> {
  if (!isCheckRequest(value)) {
    throw new Error("Invalid capture payload");
  }

  const body = value;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseBody: unknown = await response.json().catch(() => null);
  return { ok: response.ok, body: responseBody };
}

function isCheckRequest(value: unknown): value is CheckRequest {
  if (
    typeof value !== "object" ||
    value === null ||
    !("imageDataUrl" in value) ||
    typeof value.imageDataUrl !== "string" ||
    !/^data:image\/(png|jpeg);base64,/.test(value.imageDataUrl) ||
    value.imageDataUrl.length > 8_000_000 ||
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

async function readViewport(tabId: number | undefined) {
  if (tabId === undefined) {
    return { width: 1280, height: 720, devicePixelRatio: 1 };
  }

  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => ({
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      }),
    });
    return result?.result ?? { width: 1280, height: 720, devicePixelRatio: 1 };
  } catch {
    return { width: 1280, height: 720, devicePixelRatio: 1 };
  }
}
