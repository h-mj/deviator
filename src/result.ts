/**
 * Successful deviation result.
 *
 * This type of result is returned immediately and is not used by subsequent
 * deviations.
 */
export type Ok<O> = { kind: "Ok"; ok: true; value: O };

/**
 * Creates `Ok<O>` typed result object.
 */
export const ok = <O>(value: O): Ok<O> => ({ kind: "Ok", ok: true, value });

/**
 * Successful deviation intermediate result.
 *
 * The value of this result type is used as the input for subsequent deviation.
 * If this type of a result is returned by the last deviation, it is equal to
 * `Ok` result.
 */
export type Next<N> = { kind: "Next"; ok: true; value: N };

/**
 * Creates `Next<N>` typed result object.
 */
export const next = <N>(value: N): Next<N> => ({
  kind: "Next",
  ok: true,
  value
});

/**
 * Unsuccessful deviation result.
 *
 * This type of result is returned immediately.
 */
export type Err<E> = { kind: "Err"; ok: false; value: E };

/**
 * Creates `Err<E>` typed result object.
 */
export const err = <E>(value: E): Err<E> => ({ kind: "Err", ok: false, value });
