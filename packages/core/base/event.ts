import { IOctoEvent, IOctoMessage, IOctoUser } from '../types';

abstract class OctoEvent implements IOctoEvent {
  public constructor(
    public rawEvent: unknown,
    public id: string,
    public message: IOctoMessage,
    public sender: IOctoUser,
    public groupId?: string,
    public channelId?: string,
  ) {}
  /**
   * 快速回复
   */
  public abstract reply(message: IOctoMessage): void;

  public abstract get mentions(): IOctoUser[];
}

export default OctoEvent;
