import BaseService from '../base/service';
/* eslint-disable @typescript-eslint/ban-types */
import BaseLoader from './baseLoader';
import { parseFileName } from './utils';

export default class ServiceLoader extends BaseLoader {
  public static serviceMap = new Map<string, Function>();

  public constructor(ROOT: string) {
    super(ROOT, 'service');
  }

  protected async loadFn(fileName: string) {
    const { name: clazzName, type, suffix } = parseFileName(fileName);

    this.logger.debug(`loading service ${clazzName}`);

    if (suffix.length === 0 && type === this.loadPath) {
      const clazz: Function = (await import(fileName)).default;

      if (clazz && clazz.prototype && clazz.prototype instanceof BaseService) {
        ServiceLoader.serviceMap.set(clazzName, clazz);
      }
    }
  }
}
