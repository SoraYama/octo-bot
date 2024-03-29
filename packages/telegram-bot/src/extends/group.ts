import { Telegraf } from 'telegraf';
import TelegrafContext from 'telegraf/typings/context';
import { User } from 'telegraf/typings/core/types/typegram';

import { OctoGroup, OctoUser } from '@octo-bot/core';

export default class TgGroup extends OctoGroup<TelegrafContext, Telegraf<TelegrafContext>, User> {
  public async getOwnerId(): Promise<string> {
    const adminList = await this.bot.rawBot.telegram.getChatAdministrators(this.groupId);
    return adminList.find((admin) => admin.status === 'creator')!.user.id.toString();
  }

  public async getGroupMember(): Promise<OctoUser<User>[]> {
    const chat = await this.bot.rawBot.telegram.getChat(this.groupId);
    if (!('all_members_are_administrators' in chat)) {
      this.bot.logger.warn(`Chat ${this.groupId} members are not all admins`);
    }
    const admins = await this.bot.rawBot.telegram.getChatAdministrators(this.groupId);

    return admins.map((admin) => {
      const { user } = admin;
      const { id, first_name, last_name = '', is_bot, username = '' } = user;
      return this.bot.setAndGetUser(
        String(id),
        username,
        `${first_name}${last_name}`,
        user,
        is_bot,
      );
    });
  }

  public async getGroupName(): Promise<string> {
    const chat = await this.bot.rawBot.telegram.getChat(this.groupId);
    if ('title' in chat) {
      return chat.title;
    }
    return '';
  }

  public async isUserInGroup(uid: string): Promise<boolean> {
    try {
      await this.bot.rawBot.telegram.getChatMember(uid, +this.groupId);
      return true;
    } catch {
      return false;
    }
  }
}
