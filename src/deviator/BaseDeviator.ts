import { Deviation } from "../Deviation";
import { deviator } from "./Deviator";

// eslint-disable-next-line
export interface BaseDeviator<I, O, E> extends Deviation<I, O, E> {}

/**
 * Base deviation builder type.
 */
export class BaseDeviator<I, O, E> {
  /**
   * Appends specified `deviation` to the deviations chain.
   */
  public then<O2, E2>(deviation: Deviation<O, O2, E2>) {
    const composition: Deviation<I, O2, E | E2> = input => {
      const intermediate = this(input);

      return intermediate.ok ? deviation(intermediate.value) : intermediate;
    };

    return deviator(composition);
  }
}
