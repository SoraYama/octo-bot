/* eslint-disable @typescript-eslint/ban-types */
import path from 'path';

import moduleInfo from '../base/info';
import BaseModule from '../base/module';
import BaseService from '../base/service';
import BaseLoader from './baseLoader';
import ServiceLoader from './serviceLoader';
import { loadDir, parseFileName } from './utils';

export default class PluginLoader extends BaseLoader {
  public static PLUGIN_LOAD_DIR_NAMES = ['service', 'module'];

  public constructor(ROOT: string, private _pluginNames: string[]) {
    super(ROOT);
  }

  public async loadResolvedDir(): Promise<void> {
    const pluginDirs = this._pluginNames.map((name) => {
      const installedPluginDir = require.resolve(name);
      return path.resolve(installedPluginDir, '..');
    });

    this.logger.debug('detected plugin dir: ', pluginDirs);

    await Promise.all(
      pluginDirs.map((dir) =>
        PluginLoader.PLUGIN_LOAD_DIR_NAMES.map((name) =>
          loadDir(
            this.getResolvedPath(path.join(dir, name)),
            this.loadFn.bind(this),
            this.ignorePaths,
          ),
        ),
      ),
    );
  }

  protected async loadFn(fileName: string) {
    const { name: clazzName, type, suffix } = parseFileName(fileName);

    if (suffix.length === 0 && PluginLoader.PLUGIN_LOAD_DIR_NAMES.includes(type)) {
      this.logger.debug(`loading plugin ${clazzName} ${type}`);
      const clazz: Function = (await import(fileName)).default;

      if (clazz && clazz.prototype) {
        if (clazz.prototype instanceof BaseService) {
          ServiceLoader.serviceMap.set(clazzName, clazz);
        }

        if (clazz.prototype instanceof BaseModule) {
          moduleInfo.setModuleInfo(clazz, null, { clazzName });
        }
      }
    }
  }
}
