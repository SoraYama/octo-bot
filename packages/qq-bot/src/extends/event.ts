import { IMessage, IOpenAPI, IUser } from 'qq-guild-bot';

import { IOctoMessage, OctoEvent, OctoUser, SendingType } from '@octo-bot/core';

import QQBot from '../';
import QQGroup from './group';

class QQEvent extends OctoEvent<IMessage, IOpenAPI, IUser> {
  public constructor(
    public rawEvent: IMessage,
    public id: string,
    public message: IOctoMessage,
    public sender: OctoUser<IUser>,
    public bot: QQBot,
    public groupId?: string,
  ) {
    super(rawEvent, id, message, sender, bot, groupId);
  }

  public async checkIsAtMe() {
    const me = await this.bot.getBotAsUser();
    return !!this.rawEvent.mentions?.find((user) => user.id === me.id);
  }

  public async reply(message: IOctoMessage) {
    if (!message.content) {
      this.bot.logger.debug('Message cannot be sent with empty content');
      return;
    }
    this.bot.send(message, {
      type: SendingType.GroupOrChannel,
      channelOrGroupId: this.rawEvent.channel_id,
      replyMsgId: this.rawEvent.id,
    });
  }

  public getMentions() {
    if (!this.rawEvent.mentions) {
      return [];
    }
    return this.rawEvent.mentions.map((user) => {
      const { id, username, bot } = user;
      return this.bot.setAndGetUser(id, username, username, user, bot);
    });
  }

  public get group() {
    if (!this.rawEvent.guild_id) {
      return null;
    }
    return new QQGroup(this.rawEvent.guild_id, this.bot);
  }
}

export default QQEvent;
