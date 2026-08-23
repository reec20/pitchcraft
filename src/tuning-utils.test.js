import assert from "node:assert/strict";
import test from "node:test";
import { getDisplayedNoteName, getGuitarStringNumber } from "./tuning-utils.js";

test("maps low-to-high guitar buttons to strings 6 through 1", () => {
  assert.deepEqual(
    [0, 1, 2, 3, 4, 5].map(getGuitarStringNumber),
    [6, 5, 4, 3, 2, 1]
  );
});

test("uses flat note names for the half-step-down tuner display", () => {
  assert.deepEqual(
    ["D#", "G#", "C#", "F#", "A#"].map((note) => getDisplayedNoteName(note, true)),
    ["E♭", "A♭", "D♭", "G♭", "B♭"]
  );
  assert.equal(getDisplayedNoteName("C", true), "C");
  assert.equal(getDisplayedNoteName("G#", false), "G#");
});
