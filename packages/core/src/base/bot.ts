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

  public get users() {
    return this._userMap.values();
  }

  public async getBotAsUser() {
    return await this.botAdapter(this.rawBot);
  }

  public getUserById(id: string) {
    const userInMap = this._userMap.get(id);

    if (!userInMap) {
      return null;
    }

    return userInMap;
  }

  public setAndGetUser(
    id: string,
    userName: string,
    nickName: string,
    rawUser: RU,
    isBot: boolean,
  ) {
    const user = new OctoUser(id, userName, nickName, rawUser, isBot);
    this._userMap.set(id, user);

    return user;
  }

  public abstract get rawBot(): RB;

  protected abstract eventAdapter(rawEvent: RE): OctoEvent;

  protected abstract botAdapter(rawBot: RB): Promise<OctoUser>;

  public abstract send(msg: IOctoMessage, options?: ISendOptions): Promise<unknown>;

  public abstract getGroups(): Promise<OctoGroup[]>;

  public abstract run(): Promise<void>;

  protected async onMessage(rawEvent: RE, ignoreBotMsg?: boolean) {
    const event = this.eventAdapter(rawEvent);
    const asUser = await this.getBotAsUser();

    if (event.sender.id === asUser.id) {
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

    if (this.config.blockedUser.includes(event.sender.id || '')) {
      this.logger.debug(`User is blocked: ${event.sender.id}`);
      return;
    }

    if (
      this.config.enabledGroupIds &&
      event.groupId &&
      this.config.enabledGroupIds.includes(event.groupId)
    ) {
      this.logger.debug(`User is blocked: ${event.sender.id}`);
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

    // handle help text
    if (actionParam === 'help') {
      const [methodName] = ramainParams;

      if (!methodName) {
        event.reply({ content: matchedModule.helpText });
        return;
      }

      const matchedMethod = matchedModule.methodMap.get(methodName);

      if (!matchedMethod || !matchedMethod.trigger?.helpText) {
        event.reply({ content: matchedModule.helpText });
        this.logger.debug(
          `Module ${matchedModule.name} method ${methodName} does not exists or missing help text`,
        );
        return;
      }

      event.reply({ content: matchedMethod?.trigger?.helpText });
      return;
    }

    let matchedMethodName: string | null = null;

    for (const method of matchedModule.methodMap.values()) {
      const { methodName, trigger } = method;

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
