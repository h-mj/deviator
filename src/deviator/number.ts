import { ok } from "../result";
import { Deviator } from ".";

/**
 * Deviation builder which intermediate value is a number.
 */
export class NumberDeviator<I, O extends number, N, E> {
  /**
   * Rounds a number to specified decimal places.
   */
  public round(this: Deviator<I, O, N, E>, places: number) {
    return this.append(input => ok(Number(input.toFixed(places))));
  }
}
