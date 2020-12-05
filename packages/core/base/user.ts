import { IOctoUser, Priv } from '../types/IUser';
import TypeHelper from '../utils/typeHelper';

export default class OctoUser<RU = unknown> implements IOctoUser {
  public constructor(
    public id: string,
    public userName: string,
    public nickName: string,
    public rawUser: RU,
    public isBot = false,
  ) {}

  public privilege: Priv = Priv.Normal;
}
