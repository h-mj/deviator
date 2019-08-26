/**
 * Successful deviation result that is returned immediately and not used in
 * subsequent deviations.
 */
export type Now<N> = { kind: "Now"; ok: true; value: N };

/**
 * Creates `Now<N>` typed result object.
 */
export const now = <N>(value: N): Now<N> => ({ kind: "Now", ok: true, value });

/**
 * Successful deviation result which value is used as the input for subsequent
 * deviation.
 */
export type Ok<O> = { kind: "Ok"; ok: true; value: O };

/**
 * Creates `Ok<O>` typed result object.
 */
export const ok = <O>(value: O): Ok<O> => ({ kind: "Ok", ok: true, value });

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
