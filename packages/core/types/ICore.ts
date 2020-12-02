import { IBlockedUser, IOctoUser } from './IUser';

export interface IOctoOptions<RB = unknown> {
  ROOT: string;
  rawBot: RB;
  botName: string;
}

export interface IOctoBot extends IOctoUser {
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
