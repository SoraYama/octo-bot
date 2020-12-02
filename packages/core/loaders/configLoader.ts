import BaseLoader from './baseLoader';
import { IOctoBotConfig } from '../types/ICore';
import { parseFileName } from './utils';

export default class ConfigLoader extends BaseLoader {
  public configMap = new Map<string, IOctoBotConfig>();

  public constructor(ROOT: string) {
    super(ROOT, 'config');
  }

  protected async loadFn(fileName: string) {
    const { name: configName, suffix, type } = parseFileName(fileName);
    if (suffix.length > 0 && type !== this.loadPath) {
      return;
    }
    const botConfig = await import(fileName);
    this.configMap.set(configName, botConfig);
  }
}
