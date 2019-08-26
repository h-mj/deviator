import { deviate, err } from "../src";

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

    expect(result.ok).toBe(!expectedError);
    expect(result.value).toBe(expectedError ? "not_a_number" : entry[1]);
  }
});

it("checks options", () => {
  const deviation = deviate().options(["hello", "world", 12]);

  expect(deviation("hello").value).toBe("hello");
  expect(deviation("there").ok).toBe(false);
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

  expect(result.ok).toBe(true);
  expect(result.value.hello).toBe(16);
  expect(result.value.pi).toBe("hello");

  t.hello = "16.a";

  const result2 = deviation(t);

  expect(result2.ok).toBe(false);
  expect(result2.value.hello).toBe("not_a_number");
  expect(result2.value.pi).toBe(undefined);
});

it("checks for defined and undefined values", () => {
  const defined = deviate<string | undefined>().defined();
  const notDefined = deviate<string | undefined>().undefined();

  expect(defined(undefined).ok).toBe(false);
  expect(defined("Hello").ok).toBe(true);

  expect(notDefined(undefined).ok).toBe(true);
  expect(notDefined("Hello").ok).toBe(false);
});

it("replaces substrings", () => {
  const toNumber = deviate<string>()
    .replace(",", ".")
    .trim()
    .notEmpty()
    .toNumber();

  expect(toNumber("   12,5   ").value).toBe(12.5);
  expect(toNumber("   12.5   ").value).toBe(12.5);
  expect(toNumber("          ").ok).toBe(false);
  expect(toNumber("  ,12,12  ").ok).toBe(false);
});

it("validates unknown values", () => {
  const isString = deviate().string();

  expect(isString(12).ok).toBe(false);
  expect(isString([]).ok).toBe(false);
  expect(isString("hello").ok).toBe(true);
});

it("validates unknown objects", () => {
  const areCredentials = deviate()
    .object()
    .shape({
      email: deviate().string(),
      password: deviate().string()
    });

  expect(areCredentials(12).ok).toBe(false);
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

it("converts to lower case and checks if string looks like an email", () => {
  const toEmail = deviate<string>()
    .trim()
    .lowercase()
    .email();

  expect(toEmail("test@test.com").ok).toBe(true);
  expect(toEmail(" Test@test.Com ").value).toBe("test@test.com");
  expect(toEmail("no at symbol").ok).toBe(false);
});

it("runs example", () => {
  const transform = deviate<string>()
    .trim()
    .notEmpty()
    .replace(",", ".")
    .toNumber();

  expect(transform(" 12,3")).toMatchObject({
    ok: true,
    value: 12.3
  });

  expect(transform(" 12;3")).toMatchObject({
    ok: false,
    value: "not_a_number"
  });

  // Object validation
  const validate = deviate()
    .object()
    .shape({
      email: deviate()
        .string()
        .email(),
      pin: deviate().number()
    });

  expect(validate(12)).toMatchObject({
    ok: false,
    value: "not_object"
  });

  expect(validate({ email: "email" })).toMatchObject({
    ok: false,
    value: { email: "not_email", pin: "not_number" }
  });

  expect(validate({ email: "email@example.com", pin: 1234 })).toMatchObject({
    ok: true,
    value: { email: "email@example.com", pin: 1234 }
  });
});

it("appends deviations", () => {
  const parseFloatRound = deviate<string>()
    .trim()
    .notEmpty()
    .toNumber()
    .round(0);

  const unknownParseFloatRound = deviate()
    .string()
    .append(parseFloatRound);

  expect(unknownParseFloatRound([]).ok).toBe(false);
  expect(unknownParseFloatRound("Hello").ok).toBe(false);
  expect(unknownParseFloatRound(" 12.5 ").value).toBe(13);
});
