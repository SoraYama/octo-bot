import OctoBot from '../base/bot';

export interface IRedisConfig {
  username?: string;
  password?: string;
  port?: string | number;
  host?: string;
  database: string | number;
}

export interface IOctoOptions {
  ROOT: string;
  bots: OctoBot[];
  env?: string;
  redis?: IRedisConfig;
  plugins?: string[];
}

export interface IOctoBotConfig {
  botToken: string;
  bannedModules: string[];
  superUserIds: string[];
  enabledGroupIds: string[] | null;
  blockedUser: string[];
  [key: string]: string | number | Array<unknown> | null;
}
