import { Deviation } from "../Deviation";
import { err, ok } from "../result";
import { BaseDeviator } from "./BaseDeviator";

/**
 * Deviation builder which intermediate value is an `array`.
 */
// prettier-ignore
export class ArrayDeviator<I, O extends unknown[], N, E> extends BaseDeviator<I, O, N, E> {
  /**
   * Deviates each value in the array first by specified deviation and either
   * returns same sized array where elements at given index have the value of
   * the successful deviation result, or sparse array where values at given
   * index are the unsuccessful result values.
   */
  public each<O2 = never, N2 = never, E2 = never>(
    deviation: Deviation<O[number], O2, N2, E2>
  ) {
    return this.then(input => {
      const array: Array<O2 | N2> = new Array(input.length);
      const errors: Array<E2 | undefined> = new Array(input.length);

      for (let i = 0; i < input.length; ++i) {
        const result = deviation(input[i]);

        if (result.ok) {
          array[i] = result.value;
        } else {
          errors[i] = result.value;
        }
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
