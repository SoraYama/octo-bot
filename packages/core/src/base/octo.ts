import cron from 'node-cron';
import { createClient } from 'redis';

import ConfigLoader from '../loaders/configLoader';
import ModuleLoader from '../loaders/moduleLoader';
import PluginLoader from '../loaders/pluginLoader';
import ServiceLoader from '../loaders/serviceLoader';
import { IOctoOptions } from '../types/ICore';
import pkgJson from '../utils/pkgJson';
import TypeHelper from '../utils/typeHelper';
import OctoBot from './bot';
import moduleInfo from './info';
import configLogger from './logger';
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
    return pkgJson.version;
  }

  public static get configMap() {
    return Octo.getInstance().configLoader.configMap;
  }

  public bots: OctoBot[];

  public configLoader: ConfigLoader;

  public serviceLoader: ServiceLoader;

  public moduleLoader: ModuleLoader;

  public pluginLoader: PluginLoader;

  public redisClient!: ReturnType<typeof createClient>;

  public get logger() {
    return configLogger(this.options.ROOT).getLogger('Octo');
  }

  private env: string;

  private constructor(private options: IOctoOptions) {
    const { ROOT, bots, env, plugins = [] } = options;
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
    this.pluginLoader = new PluginLoader(this.options.ROOT, plugins);
  }

  private async _connectRedis() {
    const { redis } = this.options;

    if (!redis) {
      throw new Error('[redis] redis config is required');
    }

    const { username = '', password = '', host = 'localhost', port = '6379', database } = redis;
    const redisURL = new URL(`redis://${host}:${port}/${database}`);

    if (username) {
      redisURL.username = username;
    }

    if (password) {
      redisURL.password = password;
    }

    const client = createClient({
      url: redisURL.toString(),
    });

    await client.connect();

    this.redisClient = client;
  }

  public async start() {
    this.logger.info('[core] init loaders...');
    await Promise.all(
      [this.configLoader, this.moduleLoader, this.serviceLoader, this.pluginLoader].map((loader) =>
        loader.loadResolvedDir(),
      ),
    );
    this.logger.info('[core] loaders init complete');

    this.logger.info('[core] connecting redis...');
    await this._connectRedis();
    this.logger.info('[core] redis connected');

    this.bots.forEach((bot) => {
      const botConfig = this.configLoader.configMap.get(bot.platformName);

      if (!botConfig) {
        throw new Error(`Missing platform: ${bot.platformName} bot config`);
      }

      bot.redisClient = this.redisClient;

      bot.config = botConfig;

      [...schedule.allSchedule].forEach((item) => {
        const { clazz, methodName, cronStr } = item;

        const instance = Reflect.construct(clazz!, [bot]);
        const method = Reflect.get(instance, methodName!);
        const info = moduleInfo.getModuleInfo(clazz);

        if (botConfig.bannedModules.includes(info?.name || '')) {
          return;
        }

        cron.schedule(cronStr!, () => {
          Promise.resolve(Reflect.apply(method, instance, []));
        });
      });

      bot.run();
    });
  }
}
