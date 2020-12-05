import { IOctoUser, OctoGroup } from '@octo-bot/core';
import TomonBot from '..';

export interface IRawGroup {
  id: string; // required	群组的 ID
  name: string; // required	群组的名称
  icon?: string; // required	群组的图标 hash
  background?: string; // required	群组的背景图 hash
  background_props?: string; // required	群组背景图的属性
  position: number; // require 群组的位置，自己群组的排序
  joined_at: string; // required 群组的加入时间, ISO 8601 格式
  owner_id: string; // required 群组的所有者 ID
  system_channel_id?: string; // required	群组的系统频道 ID
  system_channel_flags: number; // required	群组的系统频道 Flag, 控制是否发送系统消息
  default_message_notifications: number; // required	群组的默认通知类型
}

export default class TomonGroup extends OctoGroup {
  public async getGroup(): Promise<IRawGroup> {
    return await TomonBot.rawBot.api.route(`/guilds/${this.groupId}`).get();
  }

  public async getGroupName(): Promise<string> {
    const group = await this.getGroup();
    return group.name;
  }
  public async isUserInGroup(uid: string): Promise<boolean> {
    const members = await this.getGroupMember();
    return members.some((member) => member.id === uid);
  }
  public async getOwner() {
    const group = await this.getGroup();
    return group.owner_id as string;
  }

  public async getGroupMember(): Promise<IOctoUser[]> {
    const members = await TomonBot.rawBot.api.route(`/guilds/${this.groupId}/members`).get();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (members || []).map((member: any) => {
      const { user = {} } = member;
      const { id, username: userName, name: nickName, is_bot: isBot } = user;
      return this.bot.getUser(id, userName, nickName, member, isBot);
    });
  }

  public async getChannelsInGroup() {
    return await TomonBot.rawBot.api.route(`/guilds/${this.groupId}/channels`).get();
  }
}
