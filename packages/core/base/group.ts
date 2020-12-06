import { IOctoUser } from '../types/IUser';
import OctoBot from './bot';

export default abstract class OctoGroup {
  public constructor(public groupId: string, public bot: OctoBot) {}

  public abstract getOwner(): Promise<string>;

  public abstract getGroupMember(): Promise<IOctoUser[]>;

  public abstract getGroupName(): Promise<string>;

  public abstract isUserInGroup(uid: string): Promise<boolean>;
}
