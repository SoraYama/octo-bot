import OctoBot from '../base/bot';
import { IOctoEvent } from '../types/IEvent';
import { IOctoMessage } from '../types/IMessage';
import OctoGroup from './group';
import OctoUser from './user';

abstract class OctoEvent<RE = unknown, RU = unknown> implements IOctoEvent {
  public constructor(
    public rawEvent: RE,
    public id: string,
    public message: IOctoMessage,
    public sender: OctoUser<RU>,
    public bot: OctoBot,
    public groupId?: string,
  ) {}

  public get params() {
    return this.message.content?.split?.(' ') || [];
  }

  public get remain() {
    return this.params.slice(1);
  }

  public get attachments() {
    return this.message.attachments;
  }

  public abstract checkIsAtMe(): boolean | Promise<boolean>;

  /**
   * 快速回复
   */
  public abstract reply(message: IOctoMessage): Promise<void>;

  public abstract getMentions(): OctoUser[];

  public abstract get group(): OctoGroup | null;
}

export default OctoEvent;
