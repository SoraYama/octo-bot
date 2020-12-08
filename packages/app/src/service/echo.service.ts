import { BaseService } from '@octo-bot/core';

export default class EchoService extends BaseService {
  public getRemain() {
    return this.event.remain?.slice(1).join(' ');
  }
}
