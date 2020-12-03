import OctoBot from '../base/bot';
import { IBlockedUser, IOctoUser } from './IUser';

export interface IOctoOptions {
  ROOT: string;
  bots: OctoBot[];
  env?: string;
}

export interface IOctoBotAsUser extends IOctoUser {
  platform: string;
}

export interface IOctoBotConfig {
  platformName: string;
  botToken: string;
  superUserIds: string[];
  enabledGroupIds: string[];
  blockedUser: IBlockedUser[];
  [key: string]: string | number | Record<string, unknown> | Array<unknown>;
}
