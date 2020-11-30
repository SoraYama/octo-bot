import fs from 'fs-extra';
import Loader from '.';
import { IOctoBotConfig } from '../types';
import { parseFileName } from './utils';

export default class ConfigLoader extends Loader {
  public configMap = new Map<string, IOctoBotConfig>();

  public constructor(ROOT: string) {
    super(ROOT);
    this.init();
  }

  private async init() {
    const configList = await this.getDir('config');
    configList.forEach(async (fileName) => {
      const { name, type, suffix } = parseFileName(fileName);
      this.logger.debug(`Loading config file: ${fileName}`);
      if (type !== 'config' || suffix[0] !== 'json') {
        return;
      }
      try {
        this.configMap.set(name, await fs.readJson(this.getResolvedPath('config', 'name')));
      } catch {
        this.logger.error(`caught an error when parsing ${name} config`);
      }
    });
  }
}
