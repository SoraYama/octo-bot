import OctoBot from './bot';
import OctoUser from './user';

export default abstract class OctoGroup<RE = unknown, RB = unknown, RU = unknown> {
  public constructor(public groupId: string, public bot: OctoBot<RE, RB, RU>) {}

  public abstract getOwnerId(): Promise<string>;

  public abstract getGroupMember(): Promise<OctoUser[]>;

  public abstract getGroupName(): Promise<string>;

  public abstract isUserInGroup(uid: string): Promise<boolean>;
}
