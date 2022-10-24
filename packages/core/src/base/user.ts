import { IOctoUser, Priv } from '../types/IUser';
import OctoBot from './bot';

class OctoUser<RU = unknown> implements IOctoUser<RU> {
  public get privilege(): Priv {
    return this._privilege;
  }

  public set privilege(value: Priv) {
    this._privilege = value;
    this._save();
  }

  public constructor(
    public bot: OctoBot,
    public id: string,
    public userName: string,
    public nickName: string,
    public platform: string,
    public rawUser?: RU,
    public isBot = false,
  ) {
    this._initUserFromRedis();
  }

  public toJSON() {
    return {
      id: this.id,
      userName: this.userName,
      nickName: this.nickName,
      platform: this.platform,
      isBot: this.isBot,
      privilege: this.privilege,
    };
  }

  private _privilege: Priv = Priv.Normal;

  private get _redisKey() {
    return `${this.platform}#${this.id}`;
  }

  private async _save() {
    await this.bot.redisClient.set(this._redisKey, JSON.stringify(this));
  }

  private async _initUserFromRedis() {
    const dataStr = await this.bot.redisClient.get(this._redisKey);

    if (!dataStr) {
      return;
    }

    try {
      const data = JSON.parse(dataStr) as OctoUser;
      const { privilege } = data;
      this.privilege = privilege;
    } catch (e) {
      this.bot.logger.error('parse user failed', e);
    }
  }
}

export default OctoUser;
