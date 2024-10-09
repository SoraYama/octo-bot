import { OctoGroup } from '@octo-bot/core';
import { IMessage, IUser, IOpenAPI } from 'qq-guild-bot';

class QQGroup extends OctoGroup<IMessage, IOpenAPI, IUser> {
  public async getGuildById() {
    const { data } = await this.bot.rawBot.guildApi.guild(this.groupId);

    return data;
  }

  public async getOwnerId() {
    const guild = await this.getGuildById();

    return guild.owner_id;
  }

  public async getGroupMember() {
    const { data } = await this.bot.rawBot.guildApi.guildMembers(this.groupId);
    return data.map((member) => this.bot.userAdapter(member.user));
  }

  public async getGroupName() {
    const guild = await this.getGuildById();
    return guild.name;
  }

  public async isUserInGroup(uid: string) {
    try {
      await this.bot.rawBot.guildApi.guildMember(this.groupId, uid);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export default QQGroup;
