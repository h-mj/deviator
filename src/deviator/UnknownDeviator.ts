import { err, ok } from "../result";
import { BaseDeviator } from "./BaseDeviator";

// "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"

/**
 * Deviation builder class which intermediate value extends `unknown`.
 */
// prettier-ignore
export class UnknownDeviator<I, O extends unknown, E> extends BaseDeviator<I, O, E> {
  /**
   * Checks whether current intermediate value is a `boolean`.
   */
  public boolean() {
    return this.then(input => typeof input === "boolean" ? ok(input) : err("boolean" as const));
  }

  /**
   * Checks whether current intermediate value is a `function`.
   */
  public function() {
    return this.then(input => typeof input === "function" ? ok(input) : err("function" as const));
  }

  /**
   * Checks whether current intermediate value is `null`.
   */
  public null() {
    return this.then(input => input === null ? ok(null) : err("null" as const));
  }

  /**
   * Checks whether current intermediate value is a `number`.
   */
  public number() {
    return this.then(input => typeof input === "number" ? ok(input) : err("number" as const));
  }

  /**
   * Checks whether current intermediate value is an `object`.
   */
  public object() {
    return this.then(input => typeof input === "object" && input !== null ? ok(input as O & object) : err("number" as const));
  }

  /**
   * Checks whether current intermediate value is a `string`.
   */
  public string() {
    return this.then(input => typeof input === "string" ? ok(input) : err("string" as const));
  }

  /**
   * Checks whether current intermediate value is `undefined`.
   */
  public undefined() {
    return this.then(input => typeof input === "undefined" ? ok(input) : err("string" as const));
  }
}
