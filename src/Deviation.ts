import { Err, Now, Ok } from "./result";

/**
 * Function which transforms `I` typed input and returns either successful
 * result with `O` typed value or unsuccessful result with `E` typed value.
 */
export interface Deviation<I, O, N, E> {
  (input: I): Ok<O> | Now<N> | Err<E>;
}

/**
 * Successful deviation result value type.
 */
// prettier-ignore
export type Success<D> = D extends Deviation<infer _I, infer O, infer N, infer _E>
? O | N
: never;

/**
 * Unsuccessful deviation result value type.
 */
// prettier-ignore
export type Failure<D> = D extends Deviation<infer _I, infer _O, infer _N, infer E>
? E
: never;
