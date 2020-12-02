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

export interface IBlockedUser extends IOctoUser {
  until: number;
}
