import moduleInfo from '../base/info';
import BaseModule from '../base/module';
import BaseLoader from './baseLoader';
import { parseFileName } from './utils';

export default class ModuleLoader extends BaseLoader {
  public moduleMap = new Map<string, BaseModule>();

  public constructor(ROOT: string) {
    super(ROOT, 'module');
  }

  protected async loadFn(fileName: string) {
    const { name: clazzName, type, suffix } = parseFileName(fileName);
    if (suffix.length === 0 && type === this.loadPath) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      const clazz: Function = await import(fileName);
      if (clazz?.prototype instanceof BaseModule) {
        moduleInfo.setModuleInfo(clazz, null, { clazzName });
      }
    }
  }
}
