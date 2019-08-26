import { err, ok } from "../result";
import { Deviator } from ".";

/**
 * Regular expression that matches any string that contains an `@` symbol
 * surrounded by at least 1 non-whitespace character on both sides.
 */
const EMAIL_REGEX = new RegExp(/^\S+@\S+$/i);

/**
 * Regular expression that matches any string that is a valid GUID.
 */
const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Deviation builder which intermediate value is a string.
 */
export class StringDeviator<I, O extends string, N, E> {
  /**
   * Checks whether input string contains @ symbol surrounded by at least 1
   * character on each side.
   */
  email(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      EMAIL_REGEX.test(input) ? ok(input) : err("not_email" as const)
    );
  }

  /**
   * Checks whether input string is valid GUID.
   */
  guid(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      GUID_REGEX.test(input) ? ok(input) : err("not_guid" as const)
    );
  }

  /**
   * Converts all characters of input string to lowercase.
   */
  lowercase(this: Deviator<I, O, N, E>) {
    return this.append(input => ok(input.toLowerCase()));
  }

  /**
   * Checks whether input string is not empty.
   */
  notEmpty(this: Deviator<I, O, N, E>) {
    return this.append(input =>
      input !== "" ? ok(input as Exclude<O, "">) : err("empty" as const)
    );
  }

  /**
   * Checks whether string input matches specified regular expression.
   */
  regex(this: Deviator<I, O, N, E>, regex: RegExp) {
    return this.append(input =>
      regex.test(input) ? ok(input) : err("no_regex_match" as const)
    );
  }

  /**
   * Replaces search value with specified value.
   */
  replace(
    this: Deviator<I, O, N, E>,
    searchValue: string | RegExp,
    replaceValue: string
  ) {
    return this.append(input => ok(input.replace(searchValue, replaceValue)));
  }

  /**
   * Converts input string into floating-point value.
   */
  toNumber(this: Deviator<I, O, N, E>) {
    return this.append(input => {
      const value = Number(input);
      return Number.isNaN(value) ? err("not_a_number" as const) : ok(value);
    });
  }

  /**
   * Trims input string.
   */
  trim(this: Deviator<I, O, N, E>) {
    return this.append(input => ok(input.trim()));
  }

  /**
   * Converts all characters of input string to uppercase.
   */
  uppercase(this: Deviator<I, O, N, E>) {
    return this.append(input => ok(input.toUpperCase()));
  }
}
