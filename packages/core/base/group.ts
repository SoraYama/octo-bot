import { IOctoUser } from '../types/IUser';
import OctoBot from './bot';

export default abstract class OctoGroup {
  public constructor(public groupId: string, public bot: OctoBot) {}

  public abstract async getOwner(): Promise<string>;

  public abstract async getGroupMember(): Promise<IOctoUser[]>;

  public abstract async getGroupName(): Promise<string>;

  public abstract async isUserInGroup(uid: string): Promise<boolean>;
}
