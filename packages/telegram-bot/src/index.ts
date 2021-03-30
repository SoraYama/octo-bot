import { Telegraf } from 'telegraf';
import TelegrafContext from 'telegraf/typings/context';
import { User } from 'telegraf/typings/telegram-types';
import { IOctoMessage, ISendOptions, OctoBot, OctoEvent, OctoUser } from '@octo-bot/core';
import TgEvent from './extends/event';
import TgGroup from './extends/group';

class TelegramBot extends OctoBot<TelegrafContext, Telegraf<TelegrafContext>, User> {
  private _rawBot: Telegraf<TelegrafContext> | null = null;

  public enteredGroupMap: Map<string, TgGroup> = new Map();

  public constructor(
    ROOT: string,
    platformName: string,
    private _telegrafOptions?: Partial<Telegraf.Options<TelegrafContext>>,
  ) {
    super(ROOT, platformName);
  }

  public get rawBot(): Telegraf<TelegrafContext> {
    if (!this._rawBot) {
      throw new Error('Should call `run` method first');
    }
    return this._rawBot!;
  }

  public userAdapter(user: User) {
    const { id, username, first_name, last_name, is_bot } = user;
    return this.setAndGetUser(
      String(id),
      username || '',
      `${first_name}${last_name}`,
      user,
      is_bot,
    );
  }

  public async run(): Promise<void> {
    if (!this.config.botToken) {
      this.logger.fatal('Telegram bot token is required!');
      return;
    }
    this._rawBot = new Telegraf(this.config.botToken, this._telegrafOptions);
    this._rawBot.on('message', (ctx) => {
      const { chat, from, message } = ctx;
      if (!chat || !from || !message) {
        this.logger.debug(`Message ${ctx} ignored because no 'chat' or 'from' or 'message' field`);
        return;
      }
      this.userAdapter(from);
      this.onMessage(ctx);
    });
    this._rawBot.launch();
    this.logger.info('Telegram bot started');
  }

  public async send(msg: IOctoMessage, options?: ISendOptions) {
    if (!options?.channelOrGroupId || !msg.content) {
      this.logger.warn('Msg without groupId or content', msg, options?.channelOrGroupId);
      return;
    }
    this.rawBot.telegram.sendMessage(options?.channelOrGroupId, msg.content);
  }

  public async getGroups(): Promise<TgGroup[]> {
    return Array.from(this.enteredGroupMap.values());
  }

  protected eventAdapter(rawEvent: TelegrafContext): OctoEvent<TelegrafContext, User> {
    const { message } = rawEvent;
    if (!message) {
      throw new Error('No message in Telegraf Context');
    }
    let content = '';

    if (rawEvent.message && 'text' in rawEvent.message) {
      content = rawEvent.message.text;
    }

    const octoMessage: IOctoMessage = {
      content,
      attachments: [],
    };

    return new TgEvent(
      rawEvent,
      String(message?.message_id),
      octoMessage,
      this.userAdapter(message.from!),
      this,
      String(message.chat.id),
    );
  }

  protected async onMessage(rawEvent: TelegrafContext) {
    await super.onMessage(rawEvent);
    if (rawEvent.chat) {
      if (rawEvent.chat.type === 'private') {
        return;
      }
      this.enteredGroupMap.set(
        String(rawEvent.chat.id),
        new TgGroup(String(rawEvent.chat.id), this),
      );
    }
  }

  protected async botAdapter(): Promise<OctoUser<User>> {
    const me = await this.rawBot.telegram.getMe();
    return this.userAdapter(me);
  }
}

export default TelegramBot;
