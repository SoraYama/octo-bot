import { IOctoBotConfig } from '../types/ICore';
import BaseLoader from './baseLoader';
import { parseFileName } from './utils';

export default class ConfigLoader extends BaseLoader {
  public configMap = new Map<string, IOctoBotConfig>();

  public constructor(ROOT: string) {
    super(ROOT, 'config');
  }

  protected async loadFn(fileName: string) {
    const { name: configName, suffix, type } = parseFileName(fileName);

    this.logger.debug(`loading config ${configName}`);

    if (suffix.length > 0 && type !== this.loadPath) {
      return;
    }
    const botConfig = (await import(fileName)).default;
    this.configMap.set(configName, botConfig);
  }
}
