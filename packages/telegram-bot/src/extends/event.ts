import { IOctoMessage, OctoUser, OctoEvent } from '@octo-bot/core';
import { TelegrafContext } from 'telegraf/typings/context';
import { User } from 'telegraf/typings/telegram-types';
import TelegramBot from '..';
import TgGroup from './group';

class TgEvent extends OctoEvent<TelegrafContext, User> {
  public constructor(
    public rawEvent: TelegrafContext,
    public id: string,
    public message: IOctoMessage,
    public sender: OctoUser<User>,
    public bot: TelegramBot,
    public groupId?: string,
  ) {
    super(rawEvent, id, message, sender, bot, groupId);
  }

  public async reply(message: IOctoMessage): Promise<void> {
    if (!message.content) {
      return;
    }
    await this.rawEvent.reply(message.content);
  }

  public getMentions(): OctoUser<User>[] {
    return (
      this.rawEvent.message?.entities
        ?.filter((item) => ['text_mentions', 'mentions'].includes(item.type))
        .map((item) => {
          if (item.user) {
            return this.bot.userAdapter(item.user);
          }
          return [...this.bot.users].find(
            (u) =>
              u.userName ===
              this.rawEvent.message?.text?.slice(item.offset + 1, item.offset + 1 + item.length),
          )!;
        })
        .filter((item) => !!item) || []
    );
  }

  public async checkIsAtMe(): Promise<boolean> {
    const me = await this.bot.getBotAsUser();
    return !!this.getMentions().find((item) => item.id === me.id);
  }

  public get group() {
    if (!this.rawEvent.chat || ['private', 'channel'].includes(this.rawEvent.chat.type)) {
      return null;
    }
    return new TgGroup(String(this.rawEvent.chat.id), this.bot);
  }
}

export default TgEvent;
