import { BaseService, OctoUser, Priv } from '@octo-bot/core';

export class UserService extends BaseService {
  public async checkPermission(targetUsers?: OctoUser[]) {
    if (this.event.sender.privilege < Priv.Admin) {
      this.bot.logger.info("[Permission] action rejected for sender's low privilege");
      return false;
    }

    if (!targetUsers?.length) {
      return true;
    }

    if (targetUsers.some((user) => user.privilege >= this.event.sender.privilege)) {
      this.bot.logger.info(
        "[Permission] action rejected for sender's privilege lower then target users's",
      );
      return false;
    }

    return true;
  }
}
