import { BaseDeviator } from "./BaseDeviator";

/**
 * Deviation builder class which intermediate value extends `object`.
 */
// prettier-ignore
export class ObjectDeviator<I, O extends object, E> extends BaseDeviator<I, O, E> {}
