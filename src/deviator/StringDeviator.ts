import { err, ok } from "../result";
import { BaseDeviator } from "./BaseDeviator";

/**
 * Regular expression that matches any string that contains an `@` symbol
 * surrounded by at least 1 non-whitespace character on both sides.
 */
const EMAIL_REGEXP = new RegExp(/^\S+@\S+$/i);

/**
 * Regular expression that matches any string that is a valid GUID.
 */
const GUID_REGEXP = new RegExp(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
);

/**
 * Deviation builder class which intermediate value extends `string`.
 */
// prettier-ignore
export class StringDeviator<I, O extends string, E> extends BaseDeviator<I, O, E> {
  /**
   * Checks whether current string looks like a valid email address.
   */
  public email() {
    return this.then(input => EMAIL_REGEXP.test(input) ? ok(input) : err("email" as const));
  }

  /**
   * Checks whether current string looks like a valid GUID.
   */
  public guid() {
    return this.then(input => GUID_REGEXP.test(input) ? ok(input) : err("guid" as const));
  }

  /**
   * Checks whether current string length is specified `length`.
   */
  public length(length: number) {
    return this.then(input => input.length === length ? ok(input) : err("length" as const))
  }

  /**
   * Converts all string characters to lower case.
   */
  public lowercase() {
    return this.then(input => ok(input.toLowerCase()));
  }

  /**
   * Checks whether current string length is less or equal to specified `length`.
   */
  public maxLength(length: number) {
    return this.then(input => input.length <= length ? ok(input) : err("maxLength" as const));
  }

  /**
   * Checks whether current string length is greater or equal to specified `length`.
   */
  public minLength(length: number) {
    return this.then(input => input.length >= length ? ok(input) : err("minLength" as const));
  }

  /**
   * Checks whether current string is nonempty.
   */
  public nonempty() {
    return this.then(input => input.length !== 0 ? ok(input) : err("nonempty" as const));
  }

  /**
   * Checks whether current string matches specified `regexp`.
   */
  public regexp(regexp: RegExp) {
    return this.then(input => regexp.test(input) ? ok(input) : err("regexp" as const));
  }

  /**
   * Replaces search value with specified replace value.
   */
  public replace(search: string | RegExp, replace: string) {
    return this.then(input => ok(input.replace(search, replace)));
  }

  /**
   * Converts current string value to a number.
   */
  public toNumber() {
    return this.then(input => {
      const value = Number(input);
      return !Number.isNaN(value) ? ok(value) : err("toNumber" as const);
    })
  }

  /**
   * Trims current string.
   */
  public trim() {
    return this.then(input => ok(input.trim()));
  }

  /**
   * Converts all string characters to upper case.
   */
  public uppercase() {
    return this.then(input => ok(input.toUpperCase()));
  }
}
