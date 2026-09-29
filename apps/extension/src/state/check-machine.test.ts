import { describe, expect, it } from "vitest";
import { reduceCheckState } from "./check-machine.js";

describe("check state machine", () => {
  it("runs a correct check and closes", () => {
    const checking = reduceCheckState({ status: "collapsed" }, { type: "START" });
    const correct = reduceCheckState(checking, {
      type: "RESULT",
      result: "correct",
    });
    expect(correct).toEqual({ status: "correct" });
    expect(reduceCheckState(correct, { type: "CLOSE" })).toEqual({
      status: "collapsed",
    });
  });
});

