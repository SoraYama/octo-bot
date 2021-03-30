import { OctoGroup, OctoUser } from '@octo-bot/core';
import { Guild } from 'tomon-sdk';
import TomonBot from '..';

export default class TomonGroup extends OctoGroup<TomonBot> {
  public async getGroup(): Promise<Guild> {
    return await this.bot.rawBot.api.route(`/guilds/${this.groupId}`).get();
  }

  public async getGroupName(): Promise<string> {
    const group = await this.getGroup();
    return group.name;
  }

  public async isUserInGroup(uid: string): Promise<boolean> {
    const members = await this.getGroupMember();
    return members.some((member) => member.id === uid);
  }

  public async getOwnerId() {
    const group = await this.getGroup();
    return group.owner_id as string;
  }

  public async getGroupMember(): Promise<OctoUser[]> {
    const members = await this.bot.rawBot.api.route(`/guilds/${this.groupId}/members`).get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (members || []).map((member: any) => {
      const { user = {} } = member;
      const { id, username: userName, name: nickName, is_bot: isBot } = user;
      const userInMap = this.bot.getUserById(id);
      if (userInMap) {
        return userInMap;
      }
      return this.bot.setAndGetUser(id, userName, nickName, member, isBot);
    });
  }

  public async getChannelsInGroup() {
    return await this.bot.rawBot.api.route(`/guilds/${this.groupId}/channels`).get();
  }
}
