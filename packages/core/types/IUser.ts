export enum Priv {
  Blocked = 0,
  Normal = 1,
  Admin = 2,
  White = 3,
  SuperAdmin = 4,
}

export interface IOctoUser<RU = unknown> {
  id: string;
  userName: string;
  nickName: string;
  rawUser: RU;
  isBot?: boolean;
}

export interface IBlockedUser extends IOctoUser {
  until: number;
}
