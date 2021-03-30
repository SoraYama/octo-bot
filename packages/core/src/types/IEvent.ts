import { IOctoMessage } from './IMessage';
import { IOctoUser } from './IUser';

export interface IOctoEvent<RE = unknown> {
  sender: IOctoUser;
  rawEvent: RE;
  id: string;
  message: IOctoMessage;
  groupId?: string;
}
