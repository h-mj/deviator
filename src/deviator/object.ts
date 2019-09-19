import { err, ok } from "../result";
import { Deviation, Deviator, Failure, Success } from "./";

/**
 * Type of an object that shapes an object of type `O` into some other object.
 */
type Shape<O extends object, S extends Shape<O, S>> = {
  [P in keyof S]: S[P] extends Deviation<
    P extends keyof O ? O[P] : unknown,
    unknown,
    unknown,
    unknown
  >
    ? S[P]
    : never;
};

/**
 * Result type of shape function with shape typed `S`.
 */
type ShapingResult<S extends Shape<object, object>> = {
  [P in keyof S]: Success<S[P]>;
};

/**
 * Error type of shape function with shape typed `S`.
 */
type ShapingErrors<S extends Shape<object, object>> = {
  [P in keyof S]?: Failure<S[P]>;
};

/**
 * Deviation builder which intermediate value is an object.
 */
export class ObjectDeviator<I, O extends object, N, E> {
  /**
   * Deviates all properties of type `N` into another object using given shape
   * object.
   */
  public shape<S extends Shape<O, S>>(this: Deviator<I, O, N, E>, shape: S) {
    return this.append(input => {
      const value: Partial<ShapingResult<S>> = {};
      const errors: ShapingErrors<S> = {};

      for (const property in shape) {
        // @ts-ignore
        const result = shape[property](input[property]);

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
