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

it("validates email values", () => {
  const validateEmail = deviate<string>()
    .trim()
    .nonempty()
    .lowercase()
    .email();

  expect(validateEmail("Hello")).toMatchObject({ ok: false, value: "email" });
  expect(validateEmail("  ")).toMatchObject({ ok: false, value: "nonempty" });
  expect(validateEmail(" H@t.e ")).toMatchObject({ ok: true, value: "h@t.e" });
});

it("validates guid values", () => {
  const validateGuid = deviate<string>()
    .guid()
    .uppercase();

  expect(validateGuid("notGuild")).toMatchObject({ ok: false, value: "guid" });
  expect(validateGuid("c5caae11-4a23-474e-8f1b-c3ec48c77998")).toMatchObject({
    ok: true,
    value: "C5CAAE11-4A23-474E-8F1B-C3EC48C77998"
  });
});

it("converts strings to numbers", () => {
  const toNumber = deviate<string>()
    .replace(",", ".")
    .toNumber();

  expect(toNumber("15a")).toMatchObject({ ok: false, value: "toNumber" });
  expect(toNumber("15.5")).toMatchObject({ ok: true, value: 15.5 });
  expect(toNumber("12,8")).toMatchObject({ ok: true, value: 12.8 });
});

it("checks whether string matches regexp", () => {
  const isBarcode = deviate<string>()
    .minLength(6)
    .maxLength(13)
    .regexp(/^\d+$/);

  expect(isBarcode("1234")).toMatchObject({
    ok: false,
    value: "minLength"
  });
  expect(isBarcode("123456789012345")).toMatchObject({
    ok: false,
    value: "maxLength"
  });
  expect(isBarcode("hello there")).toMatchObject({
    ok: false,
    value: "regexp"
  });
  expect(isBarcode("4444444444444")).toMatchObject({
    ok: true,
    value: "4444444444444"
  });
});

it("checks string length", () => {
  const isPin = deviate<string>()
    .length(4)
    .regexp(/^\d+$/);

  expect(isPin("1234")).toMatchObject({ ok: true, value: "1234" });
  expect(isPin("12345")).toMatchObject({ ok: false, value: "length" });
  expect(isPin("abcd")).toMatchObject({ ok: false, value: "regexp" });
});

it("validates objects", () => {
  const validCredentials = deviate()
    .object()
    .shape({
      email: deviate()
        .string()
        .email(),
      password: deviate()
        .string()
        .minLength(8)
    });

  expect(validCredentials("Hello")).toMatchObject({
    ok: false,
    value: "object"
  });

  expect(
    validCredentials({ email: "e@mail.com", password: "123" })
  ).toMatchObject({
    ok: false,
    value: {
      password: "minLength"
    }
  });

  expect(
    validCredentials({ email: "e@mail.com", password: "12345678" })
  ).toMatchObject({
    ok: true,
    value: { email: "e@mail.com", password: "12345678" }
  });
});

it("allows optional values", () => {
  const optionalString = deviate()
    .optional()
    .string()
    .trim();

  expect(optionalString(undefined)).toMatchObject({
    ok: true,
    value: undefined
  });

  expect(optionalString(42)).toMatchObject({
    ok: false,
    value: "string"
  });

  expect(optionalString("  Hello  ")).toMatchObject({
    ok: true,
    value: "Hello"
  });
});

it("checks options", () => {
  const whatTheHeckComeAfterSix = deviate().options([
    1,
    2,
    3,
    4,
    5,
    6
  ] as const);

  expect(whatTheHeckComeAfterSix("Hello")).toMatchObject({
    ok: false,
    value: "options"
  });

  expect(whatTheHeckComeAfterSix(7)).toMatchObject({
    ok: false,
    value: "options"
  });

  expect(whatTheHeckComeAfterSix(3)).toMatchObject({
    ok: true,
    value: 3
  });
});

it("validates with multiple choice deviation", () => {
  const isPrimitive = deviate().or(
    deviate().string(),
    deviate().number(),
    deviate().boolean()
  );

  expect(isPrimitive({})).toMatchObject({ ok: false, value: "or" });
  expect(isPrimitive(true)).toMatchObject({ ok: true, value: true });
  expect(isPrimitive("Hello")).toMatchObject({ ok: true, value: "Hello" });
  expect(isPrimitive(13)).toMatchObject({ ok: true, value: 13 });
});

it("validates array values", () => {
  const stringNumericArray = deviate()
    .array()
    .each(deviate().or(deviate().string(), deviate().number()));

  expect(stringNumericArray(14)).toMatchObject({ ok: false, value: "array" });
  expect(stringNumericArray([])).toMatchObject({ ok: true, value: [] });
  expect(stringNumericArray([13, "Hello"])).toMatchObject({
    ok: true,
    value: [13, "Hello"]
  });
  expect(stringNumericArray([13, 42])).toMatchObject({
    ok: true,
    value: [13, 42]
  });
  expect(stringNumericArray(["Hello", "There"])).toMatchObject({
    ok: true,
    value: ["Hello", "There"]
  });
  expect(stringNumericArray(["Hello", "There", true])).toMatchObject({
    ok: false,
    value: [undefined, undefined, "or"]
  });
});
