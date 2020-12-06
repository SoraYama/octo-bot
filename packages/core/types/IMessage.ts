export interface IAttachment {
  uri?: string;
  fileName?: string;
}

export interface IOctoMessage {
  content?: string;
  attachments?: IAttachment[];
}

export enum SendingType {
  PM = 'PM',
  GroupOrChannel = 'group',
  Broadcast = 'broadcast',
}

export interface ISendOptions {
  type: SendingType;
  userId?: string;
  channelOrGroupId?: string;
  broadcastIds?: string[];
}
