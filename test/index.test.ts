import { deviate, err, ok } from "../src";

it("uses identity function as default", () => {
  const identity = deviate();

  expect(identity("Hello")).toMatchObject({ ok: true, value: "Hello" });
  expect(identity(42)).toMatchObject({ ok: true, value: 42 });
});

it("works with custom deviations", () => {
  // prettier-ignore
  const numberToStringReverse = deviate()
    .then(input => (typeof input === "number" ? ok(input) : err("err" as const)))
    .then(input => ok(input.toString()))
    .then(input => ok(input.split("").reverse().join("")));

  expect(numberToStringReverse(500)).toMatchObject({ ok: true, value: "005" });
  expect(numberToStringReverse(1)).toMatchObject({ ok: true, value: "1" });
  expect(numberToStringReverse("1")).toMatchObject({ ok: false, value: "err" });
});
