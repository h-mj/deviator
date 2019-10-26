import { Deviation, Success } from "../Deviation";
import { err, ok } from "../result";
import { deviator } from "./Deviator";

// eslint-disable-next-line
export interface BaseDeviator<I, O, N, E> extends Deviation<I, O, N, E> {}

/**
 * Base deviation builder type.
 */
export class BaseDeviator<I, O, N, E> {
  /**
   * If any specified deviations deviate successfully current intermediate
   * value, returns successful result with returned result value. If all
   * specified deviations fail, error result with `"or"` value is returned.
   */
  public or<Ds extends Deviation<unknown, unknown, unknown, unknown>[]>(
    ...deviations: Ds
  ) {
    return this.then(input => {
      for (const deviation of deviations) {
        const result = deviation(input);

        if (result.ok) {
          return ok(result.value as Success<Ds[number]>);
        }
      }

      return err("or" as const);
    });
  }

  /**
   * Sets current intermediate value to specified `value`.
   */
  public set<T>(value: T) {
    return this.then(() => ok(value));
  }

  /**
   * Appends specified `deviation` to the deviations chain.
   */
  public then<O2 = never, N2 = never, E2 = never>(
    deviation: Deviation<O, O2, N2, E2>
  ) {
    const composition: Deviation<I, O2, N | N2, E | E2> = input => {
      const intermediate = this(input);

      return intermediate.continue
        ? deviation(intermediate.value)
        : intermediate;
    };

    return deviator(composition);
  }
}
