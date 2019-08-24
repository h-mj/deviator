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
  expect(deviation(12).value).toBe("a value");
});

it("shapes an object", () => {
  const t = {
    hello: " 16 ",
    pi: 16
  };

  const deviation = deviate<typeof t>().shape({
    hello: deviate<string>()
      .trim()
      .toNumber(),
    pi: deviate<number>().set("hello")
  });

  const result = deviation(t);

  expect(result.kind).not.toBe("Err");
  expect(result.value.hello).toBe(16);
  expect(result.value.pi).toBe("hello");

  t.hello = "16.a";

  const result2 = deviation(t);

  expect(result2.kind).toBe("Err");
  expect(result2.value.hello).toBe("not_a_number");
  expect(result2.value.pi).toBe(undefined);
});

it("checks for defined and undefined values", () => {
  const defined = deviate<string | undefined>().defined();
  const notDefined = deviate<string | undefined>().undefined();

  expect(defined(undefined).kind).toBe("Err");
  expect(defined("Hello").kind).not.toBe("Err");

  expect(notDefined(undefined).kind).not.toBe("Err");
  expect(notDefined("Hello").kind).toBe("Err");
});

it("replaces substrings", () => {
  const toNumber = deviate<string>()
    .replace(",", ".")
    .trim()
    .notEmpty()
    .toNumber();

  expect(toNumber("   12,5   ").value).toBe(12.5);
  expect(toNumber("   12.5   ").value).toBe(12.5);
  expect(toNumber("          ").kind).toBe("Err");
  expect(toNumber("  ,12,12  ").kind).toBe("Err");
});

it("validates unknown values", () => {
  const isString = deviate().string();

  expect(isString(12).kind).toBe("Err");
  expect(isString([]).kind).toBe("Err");
  expect(isString("hello").kind).not.toBe("Err");
});

it("validates unknown objects", () => {
  const areCredentials = deviate()
    .object()
    .shape({
      email: deviate().string(),
      password: deviate().string()
    });

  expect(areCredentials(12).kind).toBe("Err");
  expect(areCredentials({ email: "test@email.com" }).value).toMatchObject({
    password: "not_string"
  });
});

it("rounds numbers", () => {
  const values = {
    1: 1,
    1.5e-3: 0,
    0.02992: 0.03,
    0.005: 0.01
  };

  const round = deviate<number>().round(2);

  for (const entry of Object.entries(values)) {
    expect(round(Number(entry[0])).value).toBe(entry[1]);
  }
});

it("lowercases and checks if string looks like an email", () => {
  const toEmail = deviate<string>()
    .trim()
    .lowercase()
    .email();

  expect(toEmail("test@test.com").kind).not.toBe("Err");
  expect(toEmail(" Test@test.Com ").value).toBe("test@test.com");
  expect(toEmail("no at symbol").kind).toBe("Err");
});
