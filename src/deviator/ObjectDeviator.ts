import { Deviation, Failure, Success } from "../Deviation";
import { err, ok } from "../result";
import { BaseDeviator } from "./BaseDeviator";

/**
 * Type which is used to transform an object of type `O` into some other object.
 */
// prettier-ignore
type Schema<O extends object, S extends Schema<O, S>> = {
  [P in keyof S]: S[P] extends Deviation<P extends keyof O ? O[P] : unknown, unknown, unknown, unknown>
    ? S[P]
    : never;
};

/**
 * Successful shaping result value type.
 */
type ShapeOk<S extends Schema<object, object>> = {
  [P in keyof S]: Success<S[P]>;
};

/**
 * Unsuccessful shaping result value type.
 */
type ShapeErr<S extends Schema<object, object>> = {
  [P in keyof S]?: Failure<S[P]>;
};

/**
 * Deviation builder class which intermediate value extends `object`.
 */
// prettier-ignore
export class ObjectDeviator<I, O extends object, N, E> extends BaseDeviator<I, O, N, E> {
  /**
   * Transforms some of the properties of current object value using deviations
   * defined in specified `schema`.
   */
  public shape<S extends Schema<O, S>>(schema: S) {
    return this.then(input => {
      const value: ShapeOk<S> = {} as ShapeOk<S>;
      const errors: ShapeErr<S> = {};

      for (const property in schema) {
        // @ts-ignore
        const result = schema[property](input[property]);

        if (result.ok) {
          // @ts-ignore
          value[property] = result.value;
        } else {
          // @ts-ignore
          errors[property] = result.value;
        }
      }

      return Object.keys(errors).length === 0 ? ok(value) : err(errors);
    });
  }
}
