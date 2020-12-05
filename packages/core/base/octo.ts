import { IOctoOptions } from '../types/ICore';
import packageModule from '../package.json';
import TypeHelper from '../utils/typeHelper';
import OctoBot from './bot';
import moduleInfo from './info';
import ConfigLoader from '../loaders/configLoader';
import ModuleLoader from '../loaders/moduleLoader';
import ServiceLoader from '../loaders/serviceLoader';

export default class Octo {
  private static _instance: Octo | null = null;

  public static instance(options?: IOctoOptions) {
    if (this._instance) {
      return this._instance;
    }

    if (!options) {
      throw new Error('Options must be passed when init Octo instance');
    }

    this._instance = new Octo(options);
    return this._instance;
  }

  public static get env() {
    return this.instance().env;
  }

  public static get moduleInfo() {
    return moduleInfo.allModuleInfo;
  }

  public static get version() {
    return packageModule.version;
  }

  public static get configMap() {
    return this.instance().configLoader.configMap;
  }

  private env: string;

  private bots: OctoBot[];

  public configLoader: ConfigLoader;

  private constructor(private options: IOctoOptions) {
    const { ROOT, bots, env } = options;
    if (!TypeHelper.isString(ROOT)) {
      throw new Error(`ROOT must be string passed to Octo, now ${ROOT}`);
    }

    if (!TypeHelper.isArray(bots) || bots.length <= 0) {
      throw new Error(`bots should be not-empty-array`);
    }

    if (bots.some((bot) => bot instanceof OctoBot)) {
      throw new Error(`bots should be instance of OctoBot`);
    }

    this.env = env || process.env.NODE_ENV || 'development';
    this.bots = bots;

    this.configLoader = new ConfigLoader(this.options.ROOT);
    new ModuleLoader(this.options.ROOT);
    new ServiceLoader(this.options.ROOT);

    this.bots.forEach((bot) => bot.run());
  }
}
