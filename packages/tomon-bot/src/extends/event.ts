import { IOctoMessage, SendingType, OctoUser, OctoEvent } from '@octo-bot/core';
import { User, WSPayload } from 'tomon-sdk/lib/types';
import TomonBot from '..';
import TomonGroup from './group';

type TRawEvent = WSPayload<'MESSAGE_CREATE' | 'MESSAGE_UPDATE'>;

export default class TomonEvent extends OctoEvent<TRawEvent> {
  public constructor(
    public rawEvent: TRawEvent,
    public id: string,
    public message: IOctoMessage,
    public sender: OctoUser,
    public bot: TomonBot,
    public groupId?: string,
  ) {
    super(rawEvent, id, message, sender, bot, groupId);
  }

  public async checkIsAtMe() {
    const {
      d: { mentions },
    } = this.rawEvent;

    const me = await this.bot.getBotAsUser();

    if (!mentions) {
      return false;
    }
    return mentions.some((u) => u.id === me.id);
  }

  public async reply(message: IOctoMessage): Promise<void> {
    const channelId = this.rawEvent.d.channel_id;
    if (channelId) {
      await this.bot.send(message, {
        type: SendingType.GroupOrChannel,
        channelOrGroupId: channelId,
      });
    }
  }

  public getMentions(): OctoUser<User>[] {
    const mentions = this.rawEvent.d.mentions;
    return (mentions || [])?.map((user) =>
      this.bot.setAndGetUser(user.id, user.username, user.name, user, user.is_bot),
    );
  }

  public get group(): TomonGroup | null {
    if (!this.groupId) {
      return null;
    }
    return new TomonGroup(this.groupId, this.bot);
  }
}
