import { BaseDeviator, Deviation, Deviator, StringDeviator } from "./deviator";
import { err, next, ok } from "./result";

/**
 * Union of all deviators.
 */
const deviatorUnion = {
  ...createBaseDeviator(),
  ...createStringDeviator()
};

/**
 * Creates a deviator with given deviation function.
 */
function createDeviator<I, O, N, E>(
  deviation: Deviation<I, O, N, E>
): Deviator<I, O, N, E> {
  return Object.setPrototypeOf(deviation, deviatorUnion);
}

/**
 * Creates a deviator with input value of `I` and identity function as its
 * deviation.
 */
export const deviate = <I>(): Deviator<I, never, I, never> =>
  createDeviator(input => next(input));

/**
 * Creates an object that implements all `BaseDeviator` methods.
 */
function createBaseDeviator<I, O, N, E>() {
  const baseDeviator: BaseDeviator<I, O, N, E> = {
    append: function<O2, N2, E2>(
      this: Deviator<I, O, N, E>,
      deviation: Deviation<N, O2, N2, E2>
    ) {
      return createDeviator<I, O | O2, N2, E | E2>(input => {
        const result = this(input);
        return result.kind === "Next" ? deviation(result.value) : result;
      });
    },

    bigint: function() {
      return this.append(input =>
        typeof input === "bigint" ? next(input) : err("not_bigint")
      );
    },

    boolean: function() {
      return this.append(input =>
        typeof input === "boolean" ? next(input) : err("not_boolean")
      );
    },

    function: function() {
      return this.append(input =>
        typeof input === "function" ? next(input) : err("not_function")
      );
    },

    null: function() {
      return this.append(input =>
        input === null ? next(null) : err("not_null")
      );
    },

    number: function() {
      return this.append(input =>
        typeof input === "number" ? next(input) : err("not_number")
      );
    },

    object: function() {
      return this.append(input =>
        typeof input === "object" ? next(input) : err("not_object")
      );
    },

    optional: function() {
      return this.append(input =>
        input === undefined
          ? ok(undefined)
          : next(input as Exclude<N, undefined>)
      );
    },

    string: function() {
      return this.append(input =>
        typeof input === "string" ? next(input) : err("not_string")
      );
    },

    symbol: function() {
      return this.append(input =>
        typeof input === "symbol" ? next(input) : err("not_symbol")
      );
    },

    undefined: function() {
      return this.append(input =>
        input === undefined ? next(undefined) : err("not_undefined")
      );
    }
  };

  return baseDeviator;
}

/**
 * Creates an object that implements all `StringDeviator` methods.
 */
function createStringDeviator<I, O, N extends string, E>() {
  const stringDeviator: StringDeviator<I, O, N, E> = {
    notEmpty: function() {
      return this.append(input =>
        input.length === 0 ? err("empty") : next(input as Exclude<N, "">)
      );
    },

    toNumber: function() {
      return this.append(input => {
        const value = Number(input);

        return Number.isNaN(value) ? err("not_a_number") : next(value);
      });
    },

    trim: function() {
      return this.append(input => next(input.trim()));
    }
  };

  return stringDeviator;
}
