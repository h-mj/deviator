import { Err, Ok } from "./result";

/**
 * Function which transforms `I` typed input and returns either successful
 * result with `O` typed value or unsuccessful result with `E` typed value.
 */
export interface Deviation<I, O, E> {
  (input: I): Ok<O> | Err<E>;
}

/**
 * Successful deviation result value type.
 */
export type Success<D> = D extends Deviation<infer _I, infer O, infer _E>
  ? O
  : never;

/**
 * Unsuccessful deviation result value type.
 */
export type Failure<D> = D extends Deviation<infer _I, infer _O, infer E>
  ? E
  : never;
