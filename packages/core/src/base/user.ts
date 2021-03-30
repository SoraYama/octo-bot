import { IOctoUser, Priv } from '../types/IUser';

export default class OctoUser<RU = unknown> implements IOctoUser {
  public constructor(
    public id: string,
    public userName: string,
    public nickName: string,
    public rawUser?: RU,
    public isBot = false,
  ) {}

  public privilege: Priv = Priv.Normal;
}
