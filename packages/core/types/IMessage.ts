export enum AttachmentType {
  Reply = 'reply',
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
}

export interface IAttachment {
  type: AttachmentType;
  url?: string;
  fileName?: string;
}

export interface IOctoMessage {
  content?: string;
  attachment?: IAttachment;
}
