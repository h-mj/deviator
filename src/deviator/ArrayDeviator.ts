import { Deviation } from "../Deviation";
import { err, ok } from "../result";
import { BaseDeviator } from "./BaseDeviator";

/**
 * Deviation builder which intermediate value is an `array`.
 */
// prettier-ignore
export class ArrayDeviator<I, O extends unknown[], N, E> extends BaseDeviator<I, O, N, E> {
  /**
   * Deviates each value in the array first by `first` deviation and if that
   * fails with subsequent deviations and replaces said value with the value of
   * first successful deviation result. If all specified deviations fail, result
   * value of the first deviation is assigned to the same index as the deviated
   * value.
   */
  public each<O2 = never, N2 = never, E2 = never, Os = never, Ns = never, Es = never>(
    first: Deviation<O[number], O2, N2, E2>,
    ...deviations: Deviation<O[number], Os, Ns, Es>[]
  ) {
    return this.then(input => {
      const array: Array<O2 | Os | N2 | Ns> = new Array(input.length);
      const errors: Array<E2 | Es | undefined> = new Array(input.length);

      outer: for (let i = 0; i < input.length; ++i) {
        const firstResult = first(input[i]);

        if (firstResult.ok) {
          array[i] = firstResult.value;
          continue;
        }

        for (const deviation of deviations) {
          const result = deviation(input[i]);

          if (result.ok) {
            array[i] = result.value;
            continue outer;
          }
        }

        errors[i] = firstResult.value;
      }

      return errors.find(error => error !== undefined) === undefined
        ? ok(array)
        : err(errors);
    });
  }

  /**
   * Checks whether current array length is less or equal to specified `size`.
   */
  public maxSize(size: number) {
    return this.then(input =>
      input.length <= size ? ok(input) : err("maxSize" as const)
    );
  }

  /**
   * Checks whether current array length is greater or equal to specified `size`.
   */
  public minSize(size: number) {
    return this.then(input =>
      input.length >= size ? ok(input) : err("minSize" as const)
    );
  }

  /**
   * Checks whether current array length is equal to specified `size`.
   */
  public size(size: number) {
    return this.then(input =>
      input.length == size ? ok(input) : err("size" as const)
    );
  }
}
