import { err, ok } from "../result";
import { BaseDeviator } from "./BaseDeviator";

/**
 * Deviation builder class which intermediate value extends `number`.
 */
// prettier-ignore
export class NumberDeviator<I, O extends number, N, E> extends BaseDeviator<I, O, N, E> {
  /**
   * Checks whether current numeric value is greater than specified `value`.
   */
  public greater(value: number) {
    return this.then(input =>
      input > value ? ok(input) : err("greater" as const)
    );
  }

  /**
   * Checks whether current numeric value is an integer.
   */
  public integer() {
    return this.then(input =>
      Number.isInteger(input) ? ok(input) : err("integer" as const)
    );
  }

  /**
   * Checks whether current numeric value is less than specified `value`.
   */
  public less(value: number) {
    return this.then(input =>
      input < value ? ok(input) : err("less" as const)
    );
  }

  /**
   * Checks whether current numeric value is less or equal to specified `value`.
   */
  public max(value: number) {
    return this.then(input =>
      input <= value ? ok(input) : err("max" as const)
    );
  }

  /**
   * Checks whether current numeric value is greater or equal to specified `value`.
   */
  public min(value: number) {
    return this.then(input =>
      input >= value ? ok(input) : err("min" as const)
    );
  }

  /**
   * Checks whether current numeric value is negative.
   */
  public negative() {
    return this.then(input =>
      input < 0 ? ok(input) : err("negative" as const)
    );
  }

  /**
   * Checks whether current numeric value is positive.
   */
  public positive() {
    return this.then(input =>
      input > 0 ? ok(input) : err("positive" as const)
    );
  }
}
