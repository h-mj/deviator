import { Deviation } from "../Deviation";
import { ok } from "../result";
import { BaseDeviator } from "./BaseDeviator";
import { NumberDeviator } from "./NumberDeviator";
import { ObjectDeviator } from "./ObjectDeviator";
import { StringDeviator } from "./StringDeviator";
import { UnknownDeviator } from "./UnknownDeviator";

/**
 * Typed deviator type.
 */
// prettier-ignore
export type Deviator<I, O, N, E>
  = [O] extends [number] ? NumberDeviator<I, O, N, E>
  : [O] extends [object] ? ObjectDeviator<I, O, N, E>
  : [O] extends [string] ? StringDeviator<I, O, N, E>
  : [O] extends [unknown] ? UnknownDeviator<I, O, N, E>
  : BaseDeviator<I, O, N, E>;

/**
 * Combines all given prototypes into a single object.
 */
const combine = (...prototypes: object[]) => {
  const union: Record<string, unknown> = {};

  for (const prototype of prototypes) {
    for (const property of Object.getOwnPropertyNames(prototype)) {
      if (property !== "constructor") {
        union[property] = prototype[property as keyof typeof prototype];
      }
    }
  }

  return union;
};

/**
 * Union of typed deviators that is used as a prototype to newly created deviators.
 */
const prototype = combine(
  BaseDeviator.prototype,
  NumberDeviator.prototype,
  ObjectDeviator.prototype,
  StringDeviator.prototype,
  UnknownDeviator.prototype
);

/**
 * Returns a deviator with specified `deviation` function.
 */
export const deviator = <I = unknown, O = never, N = never, E = never>(
  deviation: Deviation<I, O, N, E>
): Deviator<I, O, N, E> => {
  // Overwrite the length property since by default it will return the number of
  // parameters of the function.
  Object.defineProperty(deviation, "length", {
    get: function() {
      return prototype.length;
    }
  });

  return Object.setPrototypeOf(deviation, prototype);
};

/**
 * Creates a deviation builder with identity function as the initial deviation.
 */
export const deviate = <I>() => deviator((input: I) => ok(input));
