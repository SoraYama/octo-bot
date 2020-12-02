import { IOctoEvent } from '../types/IEvent';
import { IOctoMessage } from '../types/IMessage';
import { IOctoUser } from '../types/IUser';
import OctoGroup from './group';

abstract class OctoEvent implements IOctoEvent {
  public constructor(
    public rawEvent: unknown,
    public id: string,
    public message: IOctoMessage,
    public sender: IOctoUser,
    public groupId?: string,
    public channelId?: string,
  ) {}

  public get params() {
    return this.message.content?.split?.(' ') || [];
  }

  public get attachment() {
    return this.message.attachment;
  }

  /**
   * 快速回复
   */
  public abstract reply(message: IOctoMessage): void;

  public abstract getMentions(): IOctoUser[];

  public abstract get group(): OctoGroup | null;
}

export default OctoEvent;
