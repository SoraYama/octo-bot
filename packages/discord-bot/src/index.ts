import { IOctoMessage, ISendOptions, OctoBot, OctoEvent } from '@octo-bot/core';
import Discord, { Message, User } from 'discord.js';
import DiscordEvent from './extends/event';
import DiscordGroup from './extends/group';

class DiscordBot extends OctoBot<Discord.Message, Discord.Client, Discord.User> {
  private _rawBot: Discord.Client | null = null;

  public constructor(
    ROOT: string,
    platformName: string,
    private _clientOptions?: Discord.ClientOptions,
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
      this.logger.fatal('Discord bot token is required in config file');
      return;
    }
    this._rawBot = new Discord.Client(this._clientOptions);
    this._rawBot.on('message', (message) => {
      if (!message.content) {
        this.logger.warn('Msg has no content', message);
        return;
      }
      const { author } = message;
      const { id, username, bot } = author;
      this.setAndGetUser(id, username, message.member?.displayName || '', author, bot);
      this.onMessage(message);
    });
    this._rawBot.login(this.config.botToken);
    this.logger.info('Discord bot started');
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
    const channel = this.rawBot.channels.cache.get(options.channelOrGroupId);
    if (!channel) {
      this.logger.warn(`Channel#${options.channelOrGroupId} is not found`);
      return;
    }
    if (!channel.isText()) {
      this.logger.warn(`Channel#${options.channelOrGroupId} is not a Text channel`);
      return;
    }
    channel.send(msg.content);
  }

  public async botAdapter() {
    if (!this.rawBot.user) {
      throw new Error('[discord-bot] client.user is null');
    }
    const { id, username } = this.rawBot.user;
    return this.setAndGetUser(id, username, '', this.rawBot.user, true);
  }

  public eventAdapter(message: Message): OctoEvent<Message, User> {
    return new DiscordEvent(
      message,
      message.id,
      {
        content: message.content,
        attachments: message.attachments
          .array()
          .map((item) => ({ uri: item.url, fileName: item.name || '' })),
      },
      this.userAdapter(message.author),
      this,
      message.guild?.id,
    );
  }

  public userAdapter(user: User, nickname?: string | null) {
    const { id, username, bot } = user;
    return this.setAndGetUser(id, username || '', nickname || '', user, bot);
  }

  public async getGroups() {
    return this.rawBot.guilds.cache.array().map((guild) => new DiscordGroup(guild.id, this));
  }
}

export default DiscordBot;
