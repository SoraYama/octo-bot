import { IOctoBot, IOctoOptions } from '../types/ICore';
import { IOctoEvent } from '../types/IEvent';
import { IOctoMessage } from '../types/IMessage';
import { IOctoUser } from '../types/IUser';
import OctoGroup from './group';
import configureLog from './logger';

export default abstract class OctoBot<RE = unknown, RB = unknown> {
  public ROOT: string;

  public rawBot: RB;

  public constructor({ ROOT, rawBot }: IOctoOptions<RB>) {
    this.ROOT = ROOT;
    this.rawBot = rawBot;
  }

  public get logger() {
    return configureLog(this.ROOT).getLogger(this.asUser.platform);
  }

  public get asUser() {
    return this.botAdapter(this.rawBot);
  }

  protected abstract eventAdapter(rawEvent: RE): IOctoEvent;

  protected abstract botAdapter(rawBot: RB): IOctoBot;

  protected onMessage(rawEvent: RE, ignoreBotMsg?: boolean) {
    const event = this.eventAdapter(rawEvent);
    if (event.sender.id === this.asUser.id) {
      return;
    }
    if (event.sender.isBot && ignoreBotMsg) {
      return;
    }

    this.handleMessage(event);
  }

  protected handleMessage(event: IOctoEvent) {
    const { content } = event.message;
    this.logger.debug(`收到消息: ${content}`);
    if (!content) {
      return;
    }

    // TODO: code here
  }

  public abstract async send(
    evt: IOctoEvent,
    msg: IOctoMessage,
    atSender?: boolean,
    atList?: IOctoUser[],
  ): Promise<void>;

  public abstract async sendToGroup(groupId: string, msg: IOctoMessage, tag: string): Promise<void>;

  public abstract async at(userId: string): Promise<void>;

  public abstract async getGroups(): Promise<OctoGroup[]>;
}
