import { IOctoMessage, OctoEvent, OctoUser } from '@octo-bot/core';
import { Message, User } from 'discord.js';
import DiscordBot from '..';
import DiscordGroup from './group';

class DiscordEvent extends OctoEvent<Message, User> {
  public constructor(
    public rawEvent: Message,
    public id: string,
    public message: IOctoMessage,
    public sender: OctoUser<User>,
    public bot: DiscordBot,
    public groupId?: string,
  ) {
    super(rawEvent, id, message, sender, bot, groupId);
  }

  public async checkIsAtMe() {
    const me = await this.bot.getBotAsUser();
    return !!this.rawEvent.mentions.members?.get?.(me.id);
  }

  public async reply(message: IOctoMessage) {
    if (!message.content) {
      return;
    }
    this.rawEvent.reply(message.content);
    if (message.attachments) {
      this.rawEvent.reply(message.attachments);
    }
  }

  public getMentions() {
    if (!this.rawEvent.mentions.members) {
      return [];
    }
    return this.rawEvent.mentions.members.map((member) => {
      const { user, nickname } = member;
      const { id, username, bot } = user;
      return this.bot.setAndGetUser(id, username, nickname || '', user, bot);
    });
  }

  public get group() {
    if (!this.rawEvent.guild) {
      return null;
    }
    return new DiscordGroup(this.rawEvent.guild.id, this.bot);
  }
}

export default DiscordEvent;
