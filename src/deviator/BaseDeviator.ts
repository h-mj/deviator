import { Deviation } from "../Deviation";
import { ok } from "../result";
import { deviator, Deviator } from "./Deviator";

// eslint-disable-next-line
export interface BaseDeviator<I, O, N, E> extends Deviation<I, O, N, E> {}

/**
 * Base deviation builder type.
 */
// prettier-ignore
export class BaseDeviator<I, O, N, E> {
  /**
   * Deviates current intermediate value first by `first` deviation and if that
   * fails with subsequent deviations and returns the successful result with
   * value of first successful deviation value. If all specified deviations
   * fail, result of the `first` deviation is returned.
   */
  public or<O2 = never, N2 = never, E2 = never, Os = never, Ns = never, Es = never>(
    first: Deviation<O, O2, N2, E2>,
    ...deviations: Deviation<O, Os, Ns, Es>[]
  ): Deviator<I, O2 | N2 | Os | Ns, N, E | E2> {
    const choice: Deviation<O, O2 | N2 | Os | Ns, never, E2> = input => {
      const initial = first(input);

      if (initial.ok) {
        return ok(initial.value);
      }

      for (const deviation of deviations) {
        const result = deviation(input);

        if (result.ok) {
          return ok(result.value);
        }
      }

      return initial;
    };

    return this.then(choice);
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
