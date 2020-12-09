/* eslint-disable @typescript-eslint/ban-types */
import { IOctoBotConfig } from '../types/ICore';
import { IOctoMessage, ISendOptions } from '../types/IMessage';
import { IModuleInfo } from '../types/IModule';
import triggerMethod from '../utils/triggerMethod';
import TypeHelper from '../utils/typeHelper';
import { defaultConfig } from './config';
import OctoEvent from './event';
import OctoGroup from './group';
import moduleInfo from './info';
import configureLog from './logger';
import OctoUser from './user';

export default abstract class OctoBot<RE = unknown, RB = unknown, RU = unknown> {
  private _userMap = new Map<string, OctoUser<RU>>();

  private _config: IOctoBotConfig = defaultConfig;

  public get config() {
    return this._config;
  }

  public set config(c: IOctoBotConfig) {
    this._config = c;
  }

  public constructor(public ROOT: string, public platformName: string) {}

  public get logger() {
    return configureLog(this.ROOT).getLogger(this.platformName);
  }

  public get asUser() {
    return this.botAdapter(this.rawBot);
  }

  public getUser(id: string, userName?: string, nickName?: string, rawUser?: RU, isBot?: boolean) {
    const userInMap = this._userMap.get(id);

    if (!userInMap) {
      if ([userName, nickName].some((i) => TypeHelper.isUndef(i))) {
        throw new Error('Missing params when construct user');
      }
      const user = new OctoUser(id, userName!, nickName!, rawUser!, isBot);
      this._userMap.set(id, user);
      return user;
    }

    return userInMap;
  }

  public abstract get rawBot(): RB;

  protected abstract eventAdapter(rawEvent: RE): OctoEvent;

  protected abstract botAdapter(rawBot: RB): OctoUser;

  public abstract send<T>(msg: IOctoMessage, options?: ISendOptions): Promise<T>;

  public abstract getGroups(): Promise<OctoGroup[]>;

  public abstract run(): Promise<void>;

  protected async onMessage(rawEvent: RE, ignoreBotMsg?: boolean) {
    const event = this.eventAdapter(rawEvent);

    if (event.sender.id === this.asUser.id) {
      return;
    }
    if (event.sender.isBot && ignoreBotMsg) {
      return;
    }

    await this.handleMessage(event);
  }

  protected async handleMessage(event: OctoEvent) {
    let { content } = event.message;

    content = content?.trim() || '';

    this.logger.debug(`Received message: ${content}`);

    if (!content) {
      return;
    }

    const [rootPath, actionParam, ...ramainParams] = event.params;

    let matchedModule: IModuleInfo | null = null;

    for (const mod of moduleInfo.allModuleInfo) {
      if (mod.modulePath === rootPath) {
        this.logger.debug(`Found module for message ${content}: ${mod.name}`);
        matchedModule = mod;
      }
    }

    if (!matchedModule) {
      this.logger.debug(`Message ${content} didn't trigger any module`);
      return;
    }

    if (!matchedModule.methodMap) {
      this.logger.debug(`Module ${matchedModule.name} has no method Map`);
      return;
    }

    if (this.config.bannedModules.includes(matchedModule.name || '')) {
      this.logger.debug(`Module ${matchedModule.name} is banned in config`);
      return;
    }

    let matchedMethodName: string | null = null;

    for (const method of matchedModule.methodMap.values()) {
      const { methodName, trigger } = method;

      if (actionParam.startsWith('help') && trigger?.helpText) {
        event.reply({ content: trigger?.helpText });
        return;
      }

      const methods = trigger?.methods || [];
      const isTriggerMatched = methods.some((m) =>
        triggerMethod([actionParam, ...ramainParams].join(' '), trigger?.match || '', m),
      );

      if (isTriggerMatched) {
        this.logger.debug(
          `module ${matchedModule.name}'s method ${method.methodName} matched msg ${content}`,
        );
        matchedMethodName = methodName!;
      }
    }

    if (!matchedMethodName) {
      this.logger.debug(`No module method found in module ${matchedModule.name}`);
      return;
    }

    await this._callMethod(matchedModule.clazz as Function, matchedMethodName, this, event);
  }

  private async _callMethod(clazz: Function, methodName: string, bot: OctoBot, event: OctoEvent) {
    const clazzInfo = moduleInfo.getModuleInfo(clazz);

    if (!clazzInfo) {
      this.logger.debug(`Cannot find class (${clazz.name}) info when call method: ${methodName}`);
      return;
    }

    const instance = Reflect.construct(clazz, [bot, event]);
    const method = Reflect.get(instance, methodName);

    if (!TypeHelper.isFunction(method)) {
      this.logger.debug(`Method ${methodName} is not callable`);
      return;
    }
    await Promise.resolve(Reflect.apply(method, instance, []));
  }
}
