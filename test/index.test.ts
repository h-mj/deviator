import { returnHello } from "../src";

it('returns "Hello"', () => {
  expect(returnHello()).toBe("Hello");
});
