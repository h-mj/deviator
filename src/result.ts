/**
 * Successful result type with `O` typed value.
 */
export interface Ok<O> {
  ok: true;
  continue: true;
  value: O;
}

/**
 * Creates a successful result with specified `value`.
 */
export const ok = <O>(value: O): Ok<O> => ({
  ok: true,
  continue: true,
  value
});

/**
 * Successful result type with `N` typed value which is returned immediately and
 * which value is not used in subsequent deviations.
 */
export interface Now<N> {
  ok: true;
  continue: false;
  value: N;
}

/**
 * Creates a successful result with specified `value` which is returned
 * immediately and which value is not used in subsequent deviations.
 */
export const now = <N>(value: N): Now<N> => ({
  ok: true,
  continue: false,
  value
});

/**
 * Unsuccessful result type with `E` typed value.
 */
export interface Err<E> {
  ok: false;
  continue: false;
  value: E;
}

/**
 * Creates an unsuccessful result with specified `value`.
 */
export const err = <E>(value: E): Err<E> => ({
  ok: false,
  continue: false,
  value
});
