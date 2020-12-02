/* eslint-disable @typescript-eslint/ban-types */
export default class TypeHelper {
  private static getType(target: unknown) {
    return Object.prototype.toString.call(target).slice(8, -1);
  }

  private static get undef(): undefined {
    return ((undef) => undef)();
  }

  public static isUndef(target: unknown): target is undefined {
    return target === TypeHelper.undef;
  }

  public static isString(target: unknown): target is string {
    return TypeHelper.getType(target) === 'String';
  }

  public static isNumber(target: unknown): target is number {
    return TypeHelper.getType(target) === 'Number';
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public static isObject(target: unknown): target is object {
    return TypeHelper.getType(target) === 'Object';
  }

  public static isFunction(target: unknown): target is Function {
    return typeof target === 'function';
  }

  public static isBoolean(target: unknown): target is boolean {
    return TypeHelper.getType(target) === 'Boolean';
  }

  public static isArray(target: unknown): target is [] {
    return TypeHelper.getType(target) === 'Array';
  }
}
