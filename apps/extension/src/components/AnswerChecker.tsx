import { useEffect, useReducer, useRef } from "react";
import { captureVisiblePage, checkCapture } from "../api/client.js";
import { reduceCheckState } from "../state/check-machine.js";

interface AnswerCheckerProps {
  host: HTMLElement;
}

const errorMessages = {
  no_selection: "Select an answer first",
  unreadable: "Unable to check this question",
  unsupported: "Unable to check this question",
  network: "Checker is unavailable",
} as const;

export function AnswerChecker({ host }: AnswerCheckerProps) {
  const [state, dispatch] = useReducer(reduceCheckState, { status: "collapsed" });
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && state.status !== "collapsed") {
        dispatch({ type: "CLOSE" });
        requestAnimationFrame(() => launcherRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.status]);

  async function checkAnswer() {
    if (state.status === "checking") return;

    dispatch({ type: "START" });
    await nextFrame();
    host.style.visibility = "hidden";
    await nextFrame();

    let capture: Awaited<ReturnType<typeof captureVisiblePage>>;
    try {
      capture = await captureVisiblePage();
    } catch {
      capture = { ok: false, reason: "network" };
    } finally {
      host.style.visibility = "visible";
    }

    if (!capture.ok) {
      dispatch({ type: "ERROR", message: errorMessages.network });
      return;
    }

    try {
      const response = await checkCapture(capture.capture);
      if (response.ok) {
        dispatch({ type: "RESULT", result: response.result });
      } else {
        dispatch({ type: "ERROR", message: errorMessages[response.reason] });
      }
    } catch {
      dispatch({ type: "ERROR", message: errorMessages.network });
    }
  }

  function close() {
    dispatch({ type: "CLOSE" });
    requestAnimationFrame(() => launcherRef.current?.focus());
  }

  if (state.status === "collapsed") {
    return (
      <button
        ref={launcherRef}
        className="tutor-launcher"
        type="button"
        aria-label="Check the selected answer with TutorAI"
        title="Check selected answer"
        onClick={() => void checkAnswer()}
      >
        ?
      </button>
    );
  }

  const label =
    state.status === "checking"
      ? "Checking answer…"
      : state.status === "correct"
        ? "Correct"
        : state.status === "incorrect"
          ? "Incorrect"
          : state.message;

  return (
    <section className="tutor-card" aria-label="TutorAI answer checker">
      <div className="tutor-row">
        {state.status === "checking" && <span className="tutor-spinner" aria-hidden="true" />}
        <strong className={`tutor-status tutor-status--${state.status}`} role="status" aria-live="polite">
          {label}
        </strong>
        <button className="tutor-icon-button" type="button" aria-label="Close" onClick={close}>
          ×
        </button>
      </div>
      {state.status !== "checking" && (
        <button className="tutor-close-button" type="button" onClick={close}>
          {state.status === "correct" ? "Done" : "Close"}
        </button>
      )}
    </section>
  );
}

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}
