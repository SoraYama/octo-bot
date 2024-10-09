import { IOctoMessage, ISendOptions, OctoBot, OctoEvent } from '@octo-bot/core';
import {
  createOpenAPI,
  createWebsocket,
  GetWsParam,
  IMessage,
  IOpenAPI,
  IUser,
} from 'qq-guild-bot';

import QQGroup from './extends/group';
import QQEvent from './extends/event';

class QQBot extends OctoBot<IMessage, IOpenAPI, IUser> {
  private _rawBot: IOpenAPI | null = null;

  public constructor(
    ROOT: string,
    platformName: string,
    private _clientOptions: GetWsParam,
  ) {
    super(ROOT, platformName);
  }

  public get rawBot() {
    if (!this._rawBot) {
      throw new Error('Should call `run` method first');
    }
    return this._rawBot;
  }

  public async run() {
    if (!this.config.botToken) {
      this.logger.fatal('QQ bot token is required in config file');
      return;
    }
    this._rawBot = createOpenAPI(this._clientOptions);
    const ws = createWebsocket(this._clientOptions);
    ws.on('PUBLIC_GUILD_MESSAGES', (data) => {
      this.logger.info('qq message received: ', data);
      if (!data?.msg) {
        this.logger.warn('Msg has no content', data);
        return;
      }
      const { author } = data.msg;
      const { id, username, bot } = author;
      this.setAndGetUser(id, username, username, author, bot);
      this.onMessage(data?.msg);
    });
    this.logger.info('QQ bot started');
  }

  public async send(msg: IOctoMessage, options: ISendOptions) {
    if (!options.channelOrGroupId) {
      this.logger.warn('channelOrGroupId is required when sending msg');
      return;
    }
    if (!msg.content) {
      this.logger.warn('Message cannot be sent with empty content');
      return;
    }
    this.rawBot?.messageApi.postMessage(options.channelOrGroupId, {
      content: msg.content,
      msg_id: options.replyMsgId,
    });
  }

  public async botAdapter() {
    if (!this.rawBot.meApi.me()) {
      throw new Error('[qq-bot] client.user is null');
    }
    const meResponse = await this.rawBot.meApi.me();
    const { data } = meResponse;
    return this.setAndGetUser(data.id, data.username, '', data, true);
  }

  public eventAdapter(message: IMessage): OctoEvent<IMessage, IOpenAPI, IUser> {
    return new QQEvent(
      message,
      message.id,
      {
        content: (message.content ?? '').replace(/^<@!\d+>/, '').trim(),
        attachments: [],
      },
      this.userAdapter(message.author),
      this,
      message.channel_id,
    );
  }

  public userAdapter(user: IUser, nickname?: string | null) {
    const { id, username, bot } = user;
    return this.setAndGetUser(id, username || '', nickname || '', user, bot);
  }

  public async getGroups(): Promise<QQGroup[]> {
    const guildsResponse = await this.rawBot.meApi.meGuilds();

    return guildsResponse.data.map((guild) => new QQGroup(guild.id, this));
  }
}

export default QQBot;
