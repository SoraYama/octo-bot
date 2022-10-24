import { BaseModule, Service, Trigger, TriggerMethod } from '@octo-bot/core';

// import { Priv } from '@octo-bot/core';
import { UserService } from '../service/user.service';

@Trigger('/user')
export class UserModule extends BaseModule {
  @Service('user')
  private userService!: UserService;

  @Trigger({ match: 'ban', methods: [TriggerMethod.Prefix] })
  public async ban() {
    const targetUsers = this.event.getMentions();

    if (await this.userService.checkPermission(targetUsers)) {
      this.event.reply({
        content: 'oops, you have no permission to ban',
      });
      return;
    }
  }
}
