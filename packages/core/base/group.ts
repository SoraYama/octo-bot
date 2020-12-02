import { IOctoUser } from '../types/IUser';

export default abstract class OctoGroup {
  public constructor(public groupId: string) {}

  public abstract async getOwner(): Promise<IOctoUser>;

  public abstract async getGroupMember(): Promise<IOctoUser[]>;

  public abstract async getGroupName(): Promise<string>;

  public abstract async isUserInGroup(uid: string): Promise<string>;
}
