/**
 * Successful result type with `O` typed value.
 */
export interface Ok<O> {
  ok: true;
  value: O;
}

/**
 * Creates a successful result with specified `value`.
 */
export const ok = <O>(value: O): Ok<O> => ({ ok: true, value });

/**
 * Unsuccessful result type with `E` typed value.
 */
export interface Err<E> {
  ok: false;
  value: E;
}

/**
 * Creates an unsuccessful result with specified `value`.
 */
export const err = <E>(value: E): Err<E> => ({ ok: false, value });
