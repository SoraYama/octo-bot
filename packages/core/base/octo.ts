import cron from 'node-cron';

import { IOctoOptions } from '../types/ICore';
import packageModule from '../package.json';
import TypeHelper from '../utils/typeHelper';
import OctoBot from './bot';
import moduleInfo from './info';
import ConfigLoader from '../loaders/configLoader';
import ModuleLoader from '../loaders/moduleLoader';
import ServiceLoader from '../loaders/serviceLoader';
import schedule from './schedule';

export default class Octo {
  private static _instance: Octo | null = null;

  public static getInstance(options?: IOctoOptions) {
    if (Octo._instance) {
      return Octo._instance;
    }

    if (!options) {
      throw new Error('Options must be passed when init Octo instance');
    }

    Octo._instance = new Octo(options);
    return Octo._instance;
  }

  public static get env() {
    return Octo.getInstance().env;
  }

  public static get moduleInfo() {
    return moduleInfo.allModuleInfo;
  }

  public static get version() {
    return packageModule.version;
  }

  public static get configMap() {
    return Octo.getInstance().configLoader.configMap;
  }

  public bots: OctoBot[];

  public configLoader: ConfigLoader;

  public serviceLoader: ServiceLoader;

  public moduleLoader: ModuleLoader;

  private env: string;

  private constructor(private options: IOctoOptions) {
    const { ROOT, bots, env } = options;
    if (!TypeHelper.isString(ROOT)) {
      throw new Error(`ROOT must be string passed to Octo, now ${ROOT}`);
    }

    if (!TypeHelper.isArray(bots) || bots.length <= 0) {
      throw new Error(`bots should be not-empty-array`);
    }

    if (bots.some((bot) => !(bot instanceof OctoBot))) {
      throw new Error(`bots should be instance of OctoBot`);
    }

    this.env = env || process.env.NODE_ENV || 'development';
    this.bots = bots;

    this.configLoader = new ConfigLoader(this.options.ROOT);
    this.moduleLoader = new ModuleLoader(this.options.ROOT);
    this.serviceLoader = new ServiceLoader(this.options.ROOT);
  }

  public async start() {
    await Promise.all(
      [this.configLoader, this.moduleLoader, this.serviceLoader].map((loader) =>
        loader.loadResolvedDir(),
      ),
    );

    this.bots.forEach((bot) => {
      [...schedule.allSchedule].forEach((item) => {
        const { clazz, methodName, cronStr } = item;

        const instance = Reflect.construct(clazz!, [bot]);
        const method = Reflect.get(instance, methodName!);

        cron.schedule(cronStr!, () => {
          Promise.resolve(Reflect.apply(method, instance, []));
        });
      });

      bot.run();
    });
  }
}
