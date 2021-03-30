import OctoBot from '../base/bot';

export interface IOctoOptions {
  ROOT: string;
  bots: OctoBot[];
  env?: string;
}

export interface IOctoBotConfig {
  botToken: string;
  bannedModules: string[];
  superUserIds: string[];
  enabledGroupIds: string[] | null;
  blockedUser: string[];
  [key: string]: string | number | Array<unknown> | null;
}
