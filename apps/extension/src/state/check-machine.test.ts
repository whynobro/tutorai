import { describe, expect, it } from "vitest";
import { reduceCheckState } from "./check-machine.js";

describe("check state machine", () => {
  it("runs a correct check and closes", () => {
    const checking = reduceCheckState({ status: "collapsed" }, { type: "START" });
    const correct = reduceCheckState(checking, {
      type: "RESULT",
      result: "correct",
      correctAnswer: "4",
    });
    expect(correct).toEqual({ status: "correct", correctAnswer: "4" });
    expect(reduceCheckState(correct, { type: "CLOSE" })).toEqual({
      status: "collapsed",
    });
  });
});

