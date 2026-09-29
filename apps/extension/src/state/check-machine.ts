export type CheckState =
  | { status: "collapsed" }
  | { status: "checking" }
  | { status: "correct" }
  | { status: "incorrect" }
  | { status: "error"; message: string };

export type CheckEvent =
  | { type: "START" }
  | { type: "RESULT"; result: "correct" | "incorrect" }
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
      return { status: event.result };
    case "ERROR":
      return { status: "error", message: event.message };
    case "CLOSE":
      return { status: "collapsed" };
  }
}

