import { err, ok } from "../result";
import { Deviator } from "./deviator";

/**
 * Deviation builder which intermediate value is a number.
 */
export class NumberDeviator<I, O extends number, N, E> {
  /**
   * Checks whether number input is greater than or equal to specified value.
   */
  public ge(this: Deviator<I, O, N, E>, value: number) {
    return this.append(input =>
      input >= value ? ok(input) : err("less_than" as const)
    );
  }

  /**
   * Checks whether number input is greater than specified value.
   */
  public gt(this: Deviator<I, O, N, E>, value: number) {
    return this.append(input =>
      input > value ? ok(input) : err("less_than_or_equals" as const)
    );
  }

  /**
   * Checks whether number input is less than or equal to specified value.
   */
  public le(this: Deviator<I, O, N, E>, value: number) {
    return this.append(input =>
      input <= value ? ok(input) : err("greater_than" as const)
    );
  }

  /**
   * Checks whether number input is less than specified value.
   */
  public lt(this: Deviator<I, O, N, E>, value: number) {
    return this.append(input =>
      input < value ? ok(input) : err("greater_than_or_equals" as const)
    );
  }

  /**
   * Rounds a number to specified decimal places.
   */
  public round(this: Deviator<I, O, N, E>, places: number) {
    return this.append(input => ok(Number(input.toFixed(places))));
  }
}
