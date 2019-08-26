import { Err, Now, Ok, ok } from "../result";
import { BaseDeviator } from "./base";
import { NumberDeviator } from "./number";
import { ObjectDeviator } from "./object";
import { StringDeviator } from "./string";

/**
 * Type of a function that takes `I` typed input and returns either `Ok<O>`,
 * `Next<N>` or `Err<E>` typed result.
 */
export interface Deviation<I, O, N, E> {
  /**
   * Deviation function that deviates input of type `I` and returns `Ok<O>`,
   * `Next<N>` or `Err<E>` type result.
   */
  (input: I): Ok<O> | Now<N> | Err<E>;
}

/**
 * If type `N` is `never`, equals to type `T`, otherwise to type `F`.
 */
type IfNever<N, T, F> = [N] extends [never] ? T : F;

/**
 * Typed deviator type.
 */
export type Deviator<I, O, N, E> = Deviation<I, O, N, E> &
  BaseDeviator<I, O, N, E> &
  IfNever<O, {}, O extends number ? NumberDeviator<I, O, N, E> : {}> &
  IfNever<O, {}, O extends object ? ObjectDeviator<I, O, N, E> : {}> &
  IfNever<O, {}, O extends string ? StringDeviator<I, O, N, E> : {}>;

/**
 * Combines all properties except constructors of all given prototypes.
 */
const combine = (...prototypes: object[]) => {
  const union: Record<string, unknown> = {};

  for (const prototype of prototypes) {
    for (const property of Object.getOwnPropertyNames(prototype)) {
      if (property !== "constructor") {
        union[property] = prototype[property as keyof object];
      }
    }
  }

  return union;
};

/**
 * Union of all type deviator methods that is used as prototype for all deviator
 * instances.
 */
const prototype = combine(
  BaseDeviator.prototype,
  NumberDeviator.prototype,
  ObjectDeviator.prototype,
  StringDeviator.prototype
);

/**
 * Creates a deviator with given deviation function.
 */
export const deviator = <I = never, O = never, N = never, E = never>(
  deviation: Deviation<I, O, N, E>
): Deviator<I, O, N, E> => {
  return Object.setPrototypeOf(deviation, prototype);
};

/**
 * Creates a deviator with input value of `I` and identity function as its
 * deviation.
 */
export const deviate = <I>() => deviator((input: I) => ok(input));
