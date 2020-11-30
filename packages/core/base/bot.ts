import configureLog from './logger';
import { IOctoBot, IOctoEvent, IOctoMessage, IOctoOptions, IOctoUser } from '../types';

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

  protected async onMessage(rawEvent: RE, ignoreBotMsg?: boolean) {
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
    atList?: IOctoUser[],
  ): Promise<void>;

  public abstract async sendToGroup(groupId: string, msg: IOctoMessage, tag: string): Promise<void>;
}
