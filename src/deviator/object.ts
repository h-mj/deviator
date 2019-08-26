import { err, ok } from "../result";
import { Deviation, Deviator } from ".";

/**
 * Type of an object that shapes an object of type `I` into some other object.
 */
// prettier-ignore
export type Shape<O extends object, S extends Shape<O, S>> = {
  [P in keyof S]: Deviation<P extends keyof O ? O[P] : unknown, unknown, unknown, unknown>;
};

/**
 * Result type of shape function with shape typed `S`.
 */
// prettier-ignore
export type ShapingResult<S extends Shape<object, object>> = {
  [P in keyof S]: S[P] extends Deviation<infer _I, infer O, infer N, infer _E> ? O | N : never;
};

/**
 * Error type of shape function with shape typed `S`.
 */
// prettier-ignore
export type ShapingErrors<S extends Shape<object, object>> = {
  [P in keyof S]?: S[P] extends Deviation<infer _I, infer _O, infer _N, infer E> ? E : never;
};

/**
 * Deviation builder which intermediate value is an object.
 */
export class ObjectDeviator<I, O extends object, N, E> {
  /**
   * Deviates all properties of type `N` into another object using given shape
   * object.
   */
  shape<S extends Shape<O, S>>(this: Deviator<I, O, N, E>, shape: S) {
    return this.append(input => {
      const value: Partial<ShapingResult<S>> = {};
      const errors: ShapingErrors<S> = {};

      for (const property in shape) {
        const result = shape[property](
          // @ts-ignore
          input[property]
        );

        if (result.kind === "Err") {
          // @ts-ignore
          errors[property] = result.value;
        } else {
          // @ts-ignore
          value[property] = result.value;
        }
      }

      return Object.entries(errors).length === 0
        ? ok(value as ShapingResult<S>)
        : err(errors);
    });
  }
}
