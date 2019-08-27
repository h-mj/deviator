import { deviate } from "../src";

it("validates types", () => {
  // prettier-ignore
  const tests = [
    [deviate().bigint(), BigInt(10000), BigInt(1200), BigInt(0)],
    [deviate().boolean(), true, false],
    [deviate().function(), () => "Hello", function() { return "World"; }],
    [deviate().null(), null],
    [deviate().number(), 12, 1000, 1e5],
    [deviate().object(), {}, { hello: "There" }, new Object()],
    [deviate().string(), "Hello", "", `${12}`],
    [deviate().symbol(), Symbol("Sybol"), Symbol()],
    [deviate().undefined(), undefined]
  ] as const;

  for (const [deviator] of tests) {
    for (const [typeDeviator, ...values] of tests) {
      for (const value of values) {
        expect(deviator(value).ok).toBe(deviator === typeDeviator);
      }
    }
  }
});

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

it("validates object containing GUID string", () => {
  const validate = deviate()
    .object()
    .shape({
      id: deviate()
        .string()
        .guid()
        .uppercase(),
      amount: deviate()
        .number()
        .round(2),
      metric: deviate().boolean()
    });

  expect(validate("A random string")).toMatchObject({
    ok: false,
    value: "not_object"
  });

  expect(validate({ id: "123456789", amount: 12 })).toMatchObject({
    ok: false,
    value: { id: "not_guid", metric: "not_boolean" }
  });

  expect(
    validate({
      id: "80ceadad-f9ab-44b4-b11e-940cc1cd85aa",
      amount: 20,
      metric: false
    })
  ).toMatchObject({
    ok: true,
    value: {
      id: "80CEADAD-F9AB-44B4-B11E-940CC1CD85AA",
      amount: 20,
      metric: false
    }
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

it("allows optional values", () => {
  const optionalRegex = deviate<string | undefined>()
    .optional()
    .regex(/^a*$/i);

  expect(optionalRegex(undefined).ok).toBe(true);
  expect(optionalRegex("bbb").ok).toBe(false);
  expect(optionalRegex("").value).toBe("");
  expect(optionalRegex("aaaa").value).toBe("aaaa");
});

it("checks strict equality", () => {
  const equalityTests = [
    ["Hello", "World", false],
    [12, 41, false],
    [[], [], false],
    [{}, {}, false],
    [false, false, true],
    ["Hello", "Hello", true]
  ] as const;

  for (const [v1, v2, equality] of equalityTests) {
    const equals = deviate<typeof v1>().equals(v2);
    const notEquals = deviate<typeof v1>().notEquals(v2);

    expect(equals(v1).ok).toBe(equality);
    expect(equals(v1).ok).not.toBe(notEquals(v1).ok);
  }
});

it("checks numeric inequality", () => {
  const inequalityTests = [
    [12, 12],
    [12, 13],
    [100, 100],
    [0.5, 0.5],
    [75, 60],
    [-50, 30]
  ];

  for (const [v1, v2] of inequalityTests) {
    const eq = deviate<number>().equals(v2);
    const ne = deviate<number>().notEquals(v2);
    const lt = deviate<number>().lt(v2);
    const le = deviate<number>().le(v2);
    const gt = deviate<number>().gt(v2);
    const ge = deviate<number>().ge(v2);

    expect(eq(v1).ok).toBe(v1 === v2);
    expect(lt(v1).ok).toBe(v1 < v2);
    expect(eq(v1).ok).not.toBe(ne(v1).ok);
    expect(eq(v1).ok).not.toBe(lt(v1).ok || gt(v1).ok);
    expect(eq(v1).ok || lt(v1).ok).toBe(le(v1).ok);
    expect(eq(v1).ok || lt(v1).ok).not.toBe(gt(v1).ok);
    expect(eq(v1).ok || gt(v1).ok).toBe(ge(v1).ok);
    expect(eq(v1).ok || gt(v1).ok).not.toBe(lt(v1).ok);
  }
});
