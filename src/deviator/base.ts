import { err, now, ok } from "../result";
import { Deviation, Deviator, deviator } from "./";

/**
 * Deviation builder which intermediate result type can be anything.
 */
export class BaseDeviator<I, O, N, E> {
  /**
   * Appends a custom deviation to the deviator.
   */
  public append<O2 = never, N2 = never, E2 = never>(
    this: Deviator<I, O, N, E>,
    deviation: Deviation<O, O2, N2, E2>
  ) {
    const composition: Deviation<I, O2, N | N2, E | E2> = input => {
      const result = this(input);
      return result.kind === "Ok" ? deviation(result.value) : result;
    };

    return deviator(composition);
  }

  /**
   * Checks whether typeof input is `"bigint"`.
   */
  public bigint(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      typeof input === "bigint" ? ok(input) : err("notBigInt" as const)
    );
  }

  /**
   * Checks whether typeof input is `"boolean"`.
   */
  public boolean(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      typeof input === "boolean" ? ok(input) : err("notBoolean" as const)
    );
  }

  /**
   * Checks whether input is not `undefined`.
   */
  public defined(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      input === undefined
        ? err("undefined" as const)
        : ok(input as Exclude<O, undefined>)
    );
  }

  /**
   * Checks whether input strictly equals specified value.
   */
  public equals<T>(this: Deviator<I, O, N, E>, value: T) {
    return this.append(input =>
      (input as O & T) === value ? ok(input as O & T) : err("notEqual" as const)
    );
  }

  /**
   * Checks whether input strictly does not equal specified value.
   */
  public notEquals<T>(this: Deviator<I, O, N, E>, value: T) {
    return this.append(input =>
      (input as O & T) !== value ? ok(input) : err("equal" as const)
    );
  }

  /**
   * Checks whether typeof input is `"function"`.
   */
  public function(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      typeof input === "function" ? ok(input) : err("notFunction" as const)
    );
  }

  /**
   * Checks whether input is `null`.
   */
  public null(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      input === null ? ok(null) : err("notNull" as const)
    );
  }

  /**
   * Checks whether typeof input is `"number"`.
   */
  public number(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      typeof input === "number" ? ok(input) : err("notNumber" as const)
    );
  }

  /**
   * Checks whether typeof input is `"object"`and value is not `null`.
   */
  public object(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      typeof input === "object" && input !== null
        ? ok(input as O & object)
        : err("notObject" as const)
    );
  }

  /**
   * Returns input value immediately if it is `undefined`.
   */
  public optional(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      input === undefined ? now(undefined) : ok(input as Exclude<O, undefined>)
    );
  }

  /**
   * Checks whether input value is one of the given options.
   */
  public options<T>(this: Deviator<I, O, N, E>, options: readonly T[]) {
    return this.append(input =>
      options.includes(input as O & T)
        ? ok(input as O & T)
        : err("notOption" as const)
    );
  }

  /**
   * Sets the deviated value.
   */
  public set<T>(this: Deviator<I, O, N, E>, value: T) {
    return this.append(() => ok(value));
  }

  /**
   * Checks whether typeof input is `"string"`.
   */
  public string(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      typeof input === "string" ? ok(input) : err("notString" as const)
    );
  }

  /**
   * Checks whether typeof input is `"symbol"`.
   */
  public symbol(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      typeof input === "symbol" ? ok(input) : err("notSymbol" as const)
    );
  }

  /**
   * Checks whether input is `undefined`.
   */
  public undefined(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      input === undefined ? ok(undefined) : err("notUndefined" as const)
    );
  }
}
