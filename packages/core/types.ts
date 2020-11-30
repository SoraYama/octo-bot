export interface IOctoOptions<RB = unknown> {
  ROOT: string;
  rawBot: RB;
  botName: string;
}

export enum AttachmentType {
  Reply = 'reply',
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
}

export enum Priv {
  Blocked = -99,
  Default = 0,
  Normal = 1,
  Admin = 10,
  White = 50,
  SuperAdmin = 99,
}

export interface IOctoUser {
  id: string;
  userName: string;
  nickName: string;
  isAdmin: boolean;
  privilege: Priv;
  rawUser: unknown;
  isBot?: boolean;
}

export interface IOctoBot extends IOctoUser {
  platform: string;
}

export interface IAttachment {
  type: AttachmentType;
  url?: string;
}

export interface IOctoMessage {
  content?: string;
  attachment?: IAttachment;
}

export interface IOctoEvent<RE = unknown> {
  sender: IOctoUser;
  rawEvent: RE;
  id: string;
  message: IOctoMessage;
  groupId?: string;
  channelId?: string;
}

export interface IOctoBotConfig {
  platformName: string;
}
