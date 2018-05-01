import "jest";
import {
  // parseLinks,
  parseTags
  // stripTags
} from "../../src/helpers/capture-parser";

test("returns empty list for no tags", () => {
  expect(parseTags("No tags")).toEqual([]);
});

test("handles empty string", () => {
  expect(parseTags("")).toEqual([]);
});
