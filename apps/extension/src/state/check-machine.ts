export type CheckState =
  | { status: "collapsed" }
  | { status: "checking" }
  | { status: "correct"; correctAnswer: string }
  | { status: "incorrect"; correctAnswer: string }
  | { status: "error"; message: string };

export type CheckEvent =
  | { type: "START" }
  | { type: "RESULT"; result: "correct" | "incorrect"; correctAnswer: string }
  | { type: "ERROR"; message: string }
  | { type: "CLOSE" };

export function reduceCheckState(
  state: CheckState,
  event: CheckEvent,
): CheckState {
  switch (event.type) {
    case "START":
      return state.status === "checking" ? state : { status: "checking" };
    case "RESULT":
      return { status: event.result, correctAnswer: event.correctAnswer };
    case "ERROR":
      return { status: "error", message: event.message };
    case "CLOSE":
      return { status: "collapsed" };
  }
}

