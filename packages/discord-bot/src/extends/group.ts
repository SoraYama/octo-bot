import { Client, Message, User } from 'discord.js';

import { OctoGroup } from '@octo-bot/core';

class DiscordGroup extends OctoGroup<Message, Client, User> {
  public async getGuildById() {
    return await this.bot.rawBot.guilds.fetch(this.groupId);
  }

  public async getOwnerId() {
    const guild = await this.getGuildById();
    return guild.ownerID;
  }

  public async getGroupMember() {
    const guild = await this.getGuildById();
    const members = await guild.members.fetch();
    return members.array().map((member) => this.bot.userAdapter(member.user));
  }

  public async getGroupName() {
    const guild = await this.getGuildById();
    return guild.name;
  }

  public async isUserInGroup(uid: string) {
    const guild = await this.getGuildById();
    return !!guild.members.cache.get(uid);
  }
}

export default DiscordGroup;
