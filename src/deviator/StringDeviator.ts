import { BaseDeviator } from "./BaseDeviator";

/**
 * Deviation builder class which intermediate value extends `string`.
 */
// prettier-ignore
export class StringDeviator<I, O extends string, E> extends BaseDeviator<I, O, E> {}
