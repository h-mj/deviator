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
  (input: I): Ok<O> | Now<N> | Err<E>;
}

/**
 * Successful deviation value type.
 */
export type Success<D> = D extends Deviation<
  infer _I,
  infer O,
  infer N,
  infer _E
>
  ? O | N
  : never;

/**
 * Failed deviation value type.
 */
export type Failure<D> = D extends Deviation<
  infer _I,
  infer _O,
  infer _N,
  infer E
>
  ? E
  : never;

/**
 * If type `N` is `never`, the type is `T`, otherwise `F`.
 */
type IfNever<N, T, F> = [N] extends [never] ? T : F;

/**
 * Typed deviator type.
 */
export type Deviator<I, O, N, E> = Deviation<I, O, N, E> &
  BaseDeviator<I, O, N, E> &
  IfNever<
    O,
    {},
    (O extends number ? NumberDeviator<I, O, N, E> : {}) &
      (O extends object ? ObjectDeviator<I, O, N, E> : {}) &
      (O extends string ? StringDeviator<I, O, N, E> : {})
  >;
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
