import { deviate } from "../src";

it("trims and converts a string to a float", () => {
  const deviation = deviate<string>()
    .trim()
    .toNumber();

  const values = {
    "      69.1        ": 69.1,
    "         11": 11.0,
    "    a": false,
    "400     ": 400,
    " .1a  ": false
  };

  for (const entry of Object.entries(values)) {
    const result = deviation(entry[0]);
    const expectedError = entry[1] === false;

    expect(result.kind).toBe(expectedError ? "Err" : "Next");
    expect(result.value).toBe(expectedError ? "not_a_number" : entry[1]);
  }
});

it("checks options", () => {
  const deviation = deviate().options(["hello", "world", 12]);

  expect(deviation("hello").value).toBe("hello");
  expect(deviation("there").kind).toBe("Err");
  expect(deviation("there").value).toBe("not_option");
});

it("sets a value", () => {
  const deviation = deviate().set("a value");

  expect(deviation("hello").value).toBe("a value");
});
