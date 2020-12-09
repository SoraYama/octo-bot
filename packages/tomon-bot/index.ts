import Octo, { IOctoMessage, ISendOptions, OctoBot, SendingType } from '@octo-bot/core';
import RawBot from 'tomon-sdk';
import { User, WSPayload } from 'tomon-sdk/lib/types';
import TomonEvent from './extends/event';
import TomonGroup, { IRawGroup } from './extends/group';

class TomonBot extends OctoBot<WSPayload<'MESSAGE_CREATE' | 'MESSAGE_UPDATE'>, RawBot, User> {
  public static rawBot = new RawBot();

  public get rawBot() {
    return TomonBot.rawBot;
  }

  public constructor(ROOT: string, platformName: string) {
    super(ROOT, platformName);
    this.rawBot.on('MESSAGE_CREATE', (evt) => {
      this.onMessage(evt);
    });
  }

  public async getGroups(): Promise<TomonGroup[]> {
    const groups: IRawGroup[] = await this.rawBot.api.route('/users/@me/guilds').get();
    this.logger.debug('fetched guilds: ', groups);
    return groups.map((g) => new TomonGroup(g.id, this));
  }

  public async send(msg: IOctoMessage, options?: ISendOptions) {
    const handledOptions: ISendOptions = {
      type: SendingType.GroupOrChannel,
      ...options,
    };

    // const { type, userId, channelOrGroupId, broadcastIds } = handledOptions;
    const { type, channelOrGroupId } = handledOptions;

    try {
      switch (type) {
        case SendingType.PM: {
          this.logger.warn('Not available yet');
          // TODO: code here
          return;
        }
        case SendingType.GroupOrChannel: {
          if (!channelOrGroupId) {
            throw new Error(
              `Trying to send msg to channel but without channel id, ${handledOptions}`,
            );
          }

          return await this.rawBot.api.route(`/channels/${channelOrGroupId}/messages`).post({
            data: {
              content: msg.content,
              files: msg.attachments?.map((att) => att.uri),
            },
          });
        }
        case SendingType.Broadcast: {
          const groups = await this.getGroups();
          groups.forEach(async (group) => {
            const channels = await group.getChannelsInGroup();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            channels.forEach((channel: any) => {
              this.send(msg, { type: SendingType.GroupOrChannel, channelOrGroupId: channel.id });
            });
          });
        }
      }
    } catch (e) {
      this.logger.error(`Send message ${JSON.stringify(msg)} failed!`, e);
      return;
    }
  }

  public async run() {
    const config = Octo.configMap.get(this.platformName);

    if (!config) {
      throw new Error(
        `Cannot find ${this.platformName} config, please check whether ${this.platformName}.config.ts in config dir`,
      );
    }

    if (!config.botToken) {
      throw new Error(`config ${this.platformName} has no 'botToken'`);
    }

    this.rawBot.start(config.botToken);
  }

  protected eventAdapter(rawEvent: WSPayload<'MESSAGE_CREATE' | 'MESSAGE_UPDATE'>): TomonEvent {
    const message: IOctoMessage = {
      content: rawEvent.d.content,
      attachments: rawEvent.d.attachments.map((att) => ({
        uri: att.url,
        fileName: att.filename,
      })),
    };

    const { id, username, name, is_bot: isBot } = rawEvent.d.author;

    return new TomonEvent(
      rawEvent,
      rawEvent.d.id,
      message,
      this.getUser(id, username, name, rawEvent.d.author, isBot),
      this,
      // TODO: fix in sdk
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (rawEvent.d as any).guild_id,
    );
  }

  protected botAdapter(rawBot: RawBot) {
    return this.getUser(rawBot.id!, rawBot.username, rawBot.name, undefined, true);
  }
}

export default TomonBot;
