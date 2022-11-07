import { Message } from 'discord.js';

import { BaseModule, Service, Trigger, TriggerMethod } from '@octo-bot/core';
import TelegramBot from '@octo-bot/telegram-bot';

import { UserService } from '../service/user.service';

@Trigger('/user')
class UserModule extends BaseModule {
  @Service('user')
  private userService!: UserService;

  @Trigger({ match: 'list', methods: [TriggerMethod.Prefix] })
  public async list() {
    const users = Array.from(this.bot.users);

    await this.event.reply({
      content: users.map((u) => `${u.id}: ${u.nickName}`).join('\n'),
    });
  }

  @Trigger({ match: 'ban', methods: [TriggerMethod.Prefix] })
  public async ban() {
    const targetUsers = this.event.getMentions();

    if (await this.userService.checkPermission(targetUsers)) {
      this.event.reply({
        content: 'oops, you have no permission to ban',
      });
      return;
    }

    if (!this.event.group) {
      this.event.reply({ content: 'Bot is only able to ban user in groups' });
      return;
    }

    const [duration] = this.event.remain;

    if (duration && isNaN(Number(duration))) {
      this.event.reply({ content: 'Duration only can be digit for seconds' });
      return;
    }

    switch (this.bot.platformName) {
      case 'telegram': {
        await Promise.all(
          targetUsers.map((user) => {
            return (this.bot as TelegramBot).rawBot.telegram.banChatMember(
              this.event.groupId!,
              Number(user.id),
              Date.now() / 1000 + Number(duration),
            );
          }),
        );
        break;
      }

      case 'discord': {
        const event = this.event.rawEvent as Message;

        if (!event.member?.hasPermission('BAN_MEMBERS')) {
          this.event.reply({ content: 'You have no permission to ban other users - -' });
          return;
        }

        if (!event.mentions.members?.size) {
          this.event.reply({ content: 'Should ban at least one member' });
          return;
        }

        await Promise.all(event.mentions.members!.map((user) => user.ban()));

        break;
      }

      default: {
        this.event.reply({
          content: `Oops, currently cannot ban user on ${this.bot.platformName}`,
        });
        return;
      }
    }

    this.event.reply({ content: `${this.event.sender.id} has banned` });
  }
}

export default UserModule;
