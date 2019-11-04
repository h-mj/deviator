import { err, now, ok } from "../result";
import { BaseDeviator } from "./BaseDeviator";

/**
 * Deviation builder class which intermediate value extends `unknown`.
 */
// prettier-ignore
export class UnknownDeviator<I, O extends unknown, N, E> extends BaseDeviator<I, O, N, E> {
  /**
   * Checks whether current intermediate value is an `Array`.
   */
  public array() {
    return this.then(input =>
      Array.isArray(input) ? ok(input as unknown[]) : err("array" as const)
    );
  }

  /**
   * Checks whether current intermediate value is a `boolean`.
   */
  public boolean() {
    return this.then(input =>
      typeof input === "boolean" ? ok(input) : err("boolean" as const)
    );
  }

  /**
   * Checks whether current intermediate value is not `undefined`.
   */
  public defined() {
    return this.then(input =>
      typeof input !== "undefined"
        ? ok(input as Exclude<O, undefined>)
        : err("defined" as const)
    );
  }

  /**
   * Checks whether current intermediate value is a `function`.
   */
  public function() {
    return this.then(input =>
      typeof input === "function" ? ok(input) : err("function" as const)
    );
  }

  /**
   * Checks whether current intermediate value is `null`.
   */
  public null() {
    return this.then(input =>
      input === null ? ok(null) : err("null" as const)
    );
  }

  /**
   * If current intermediate value is `null`, returns successful result with
   * `null` value immediately. Otherwise continues the deviation.
   */
  public nullable() {
    return this.then(input =>
      input === null
        ? now(null)
        : ok(input as Exclude<O, null>)
    );
  }

  /**
   * Checks whether current intermediate value is a `number`.
   */
  public number() {
    return this.then(input =>
      typeof input === "number" ? ok(input) : err("number" as const)
    );
  }

  /**
   * Checks whether current intermediate value is an `object`.
   */
  public object() {
    return this.then(input =>
      typeof input === "object" && input !== null
        ? ok(input as O & object)
        : err("object" as const)
    );
  }

  /**
   * If current intermediate value is `undefined`, returns successful result
   * with `undefined` value immediately. Otherwise continues the deviation.
   */
  public optional() {
    return this.then(input =>
      typeof input === "undefined"
        ? now(input)
        : ok(input as Exclude<O, undefined>)
    );
  }

  /**
   * Checks whether current intermediate value is one of the specified `options`.
   */
  public options<T>(options: readonly T[]) {
    return this.then(input =>
      options.includes(input as O & T)
        ? ok(input as O & T)
        : err("options" as const)
    );
  }

  /**
   * Checks whether current intermediate value is a `string`.
   */
  public string() {
    return this.then(input =>
      typeof input === "string" ? ok(input) : err("string" as const)
    );
  }

  /**
   * Checks whether current intermediate value is `undefined`.
   */
  public undefined() {
    return this.then(input =>
      typeof input === "undefined" ? ok(input) : err("undefined" as const)
    );
  }
}
