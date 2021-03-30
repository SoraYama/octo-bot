import OctoBot from './bot';
import OctoUser from './user';

export default abstract class OctoGroup<Bot extends OctoBot = OctoBot> {
  public constructor(public groupId: string, public bot: Bot) {}

  public abstract getOwnerId(): Promise<string>;

  public abstract getGroupMember(): Promise<OctoUser[]>;

  public abstract getGroupName(): Promise<string>;

  public abstract isUserInGroup(uid: string): Promise<boolean>;
}
