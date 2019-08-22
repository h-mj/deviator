import { Err, Next, Ok } from "./result";

/**
 * Type of a function that takes `I` typed input and returns either `Ok<O>`,
 * `Next<N>` or `Err<E>` typed result.
 */
export interface Deviation<I, O, N, E> {
  /**
   * Deviation function that deviates input of type `I` and returns `Ok<O>`,
   * `Next<N>` or `Err<E>` type result.
   */
  (input: I): Ok<O> | Next<N> | Err<E>;
}

/**
 * Typed deviator type.
 */
export type Deviator<I, O, N, E> = Deviation<I, O, N, E> &
  BaseDeviator<I, O, N, E> &
  (N extends string ? StringDeviator<I, O, N, E> : {});

/**
 * Base deviation builder type.
 */
export interface BaseDeviator<I, O, N, E> {
  /**
   * Appends a custom deviation to the deviator.
   */
  append<O2, N2, E2>(
    this: Deviator<I, O, N, E>,
    deviation: Deviation<N, O2, N2, E2>
  ): Deviator<I, O | O2, N2, E | E2>;

  /**
   * Checks whether typeof input is `"bigint"`.
   */
  bigint(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, N & bigint, E | "not_bigint">;

  /**
   * Checks whether typeof input is `"boolean"`.
   */
  boolean(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, N & boolean, E | "not_boolean">;

  /**
   * Checks whether typeof input is `"function"`.
   */
  function(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, N & Function, E | "not_function">;

  /**
   * Checks whether input is `null`.
   */
  null(this: Deviator<I, O, N, E>): Deviator<I, O, null, E | "not_null">;

  /**
   * Checks whether typeof input is `"number"`.
   */
  number(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, N & number, E | "not_number">;

  /**
   * Checks whether typeof input is `"object"`.
   */
  object(this: Deviator<I, O, N, E>): Deviator<I, O, N, E | "not_object">;

  /**
   * Returns input value immediately if it is `undefined`.
   */
  optional(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O | undefined, Exclude<N, undefined>, E>;

  /**
   * Checks whether typeof input is `"string"`.
   */
  string(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, N & string, E | "not_string">;

  /**
   * Checks whether typeof input is `"symbol"`.
   */
  symbol(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, N & symbol, E | "not_symbol">;

  /**
   * Checks whether input is `undefined`.
   */
  undefined(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, undefined, E | "not_undefined">;
}

/**
 * Deviation builder which intermediate value is string.
 */
export interface StringDeviator<I, O, N extends string, E> {
  /**
   * Checks whether input string is not empty.
   */
  notEmpty(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, Exclude<N, "">, E | "empty">;

  /**
   * Converts input string into floating-point value.
   */
  toNumber(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, number, E | "not_a_number">;

  /**
   * Trims input string.
   */
  trim(this: Deviator<I, O, N, E>): Deviator<I, O, string, E>;
}
