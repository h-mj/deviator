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
  (N extends number ? NumberDeviator<I, O, N, E> : {}) &
  (N extends object ? ObjectDeviator<I, O, N, E> : {}) &
  (N extends string ? StringDeviator<I, O, N, E> : {});

/**
 * Base deviation builder type.
 */
export interface BaseDeviator<I, O, N, E> {
  /**
   * Appends a custom deviation to the deviator.
   */
  append<O2 = never, N2 = never, E2 = never>(
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
   * Checks whether input is not `undefined`.
   */
  defined(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, Exclude<N, undefined>, E | "undefined">;

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
   * Checks whether typeof input is `"object"`and value is not `null`.
   */
  object(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, N & object, E | "not_object">;

  /**
   * Returns input value immediately if it is `undefined`.
   */
  optional(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O | undefined, Exclude<N, undefined>, E>;

  /**
   * Checks whether input value is one of the given options.
   */
  options<T>(
    this: Deviator<I, O, N, E>,
    options: readonly T[]
  ): Deviator<I, O, N & T, E | "not_option">;

  /**
   * Sets the deviated value.
   */
  set<T>(this: Deviator<I, O, N, E>, value: T): Deviator<I, O, T, E>;

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
 * Deviation builder which intermediate value is a number.
 */
export interface NumberDeviator<I, O, N extends number, E> {
  /**
   * Rounds a number to specified decimal places.
   */
  round(this: Deviator<I, O, N, E>, places: number): Deviator<I, O, number, E>;
}

/**
 * Type of an object that shapes an object of type `I` into some other object.
 */
export type Shape<I extends object, S extends Shape<I, S>> = {
  [P in keyof S]: Deviation<
    P extends keyof I ? I[P] : unknown,
    unknown,
    unknown,
    unknown
  >;
};

/**
 * Result type of shape function with shape typed `S`.
 */
export type ShapingResult<S extends Shape<object, object>> = {
  [P in keyof S]: S[P] extends Deviation<infer _I, infer O, infer N, infer _E>
    ? O | N
    : never;
};

/**
 * Error type of shape function with shape typed `S`.
 */
export type ShapingErrors<S extends Shape<object, object>> = {
  [P in keyof S]?: S[P] extends Deviation<infer _I, infer _O, infer _N, infer E>
    ? E
    : never;
};

/**
 * Deviation builder which intermediate value is an object.
 */
export interface ObjectDeviator<I, O, N extends object, E> {
  /**
   * Deviates all properties of type `N` into another object using given shape
   * object.
   */
  shape<S extends Shape<N, S>>(
    this: Deviator<I, O, N, E>,
    shape: S
  ): Deviator<I, O, ShapingResult<S>, E | ShapingErrors<S>>;
}

/**
 * Deviation builder which intermediate value is a string.
 */
export interface StringDeviator<I, O, N extends string, E> {
  /**
   * Checks whether input string contains @ symbol surrounded by at least 1
   * character on each side.
   */
  email(this: Deviator<I, O, N, E>): Deviator<I, O, N, E | "not_email">;

  /**
   * Checks whether input string is valid GUID.
   */
  guid(this: Deviator<I, O, N, E>): Deviator<I, O, N, E | "not_guid">;

  /**
   * Converts all characters of input string to lowercase.
   */
  lowercase(this: Deviator<I, O, N, E>): Deviator<I, O, string, E>;

  /**
   * Checks whether input string is not empty.
   */
  notEmpty(
    this: Deviator<I, O, N, E>
  ): Deviator<I, O, Exclude<N, "">, E | "empty">;

  /**
   * Checks whether string input matches specified regular expression.
   */
  regex(
    this: Deviator<I, O, N, E>,
    regex: RegExp
  ): Deviator<I, O, N, E | "no_regex_match">;

  /**
   * Replaces search value with specified value.
   */
  replace(
    this: Deviator<I, O, N, E>,
    searchValue: string | RegExp,
    replaceValue: string
  ): Deviator<I, O, string, E>;

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

  /**
   * Converts all characters of input string to uppercase.
   */
  uppercase(this: Deviator<I, O, N, E>): Deviator<I, O, string, E>;
}
