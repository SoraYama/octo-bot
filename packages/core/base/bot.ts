/* eslint-disable @typescript-eslint/ban-types */
import { IOctoBotAsUser } from '../types/ICore';
import { IOctoMessage } from '../types/IMessage';
import { IModuleInfo } from '../types/IModule';
import { IOctoUser } from '../types/IUser';
import triggerMethod from '../utils/triggerMethod';
import TypeHelper from '../utils/typeHelper';
import OctoEvent from './event';
import OctoGroup from './group';
import moduleInfo from './info';
import configureLog from './logger';

export default abstract class OctoBot<RE = unknown, RB = unknown> {
  public constructor(public ROOT: string, public rawBot: RB, public botName: string) {}

  public get logger() {
    return configureLog(this.ROOT).getLogger(this.asUser.platform);
  }

  public get asUser() {
    return this.botAdapter(this.rawBot);
  }

  protected abstract eventAdapter(rawEvent: RE): OctoEvent;

  protected abstract botAdapter(rawBot: RB): IOctoBotAsUser;

  public abstract async send(
    msg: IOctoMessage,
    atSender?: boolean,
    atList?: IOctoUser[],
  ): Promise<void>;

  public abstract async sendToGroup(groupId: string, msg: IOctoMessage, tag: string): Promise<void>;

  public abstract async at(userId: string): Promise<void>;

  public abstract async getGroups(): Promise<OctoGroup[]>;

  public abstract async run(): Promise<void>;

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
    const { content } = event.message;
    this.logger.debug(`Received message: ${content}`);
    if (!content) {
      return;
    }

    const [rootPath, ...ramainParams] = event.params;

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
      this.logger.debug(`module ${matchedModule.name} has no method Map`);
      return;
    }

    let matchedMethodName: string | null = null;

    for (const method of matchedModule.methodMap.values()) {
      const { methodName, trigger } = method;
      const methods = method.trigger?.method || [];
      const isTriggerMatched = methods.some((m) =>
        triggerMethod(ramainParams.join(' '), trigger?.match || '', m),
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

    await this.callMethod(matchedModule.clazz as Function, matchedMethodName, this, event);
  }

  private async callMethod(clazz: Function, methodName: string, bot: OctoBot, event: OctoEvent) {
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
