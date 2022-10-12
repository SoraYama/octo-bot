import {
  BaseModule,
  Schedule,
  SendingType,
  Service,
  Trigger,
  TriggerMethod,
} from '@octo-bot/core';

import EchoService from '../service/echo.service';

@Trigger('/echo')
class EchoModule extends BaseModule {
  @Service('echo')
  private echoService!: EchoService;

  @Trigger({
    match: 'test',
    methods: [TriggerMethod.Prefix],
    helpText: 'test bot',
    platforms: ['telegram'],
  })
  public async echo() {
    await this.event.reply({
      content: this.echoService.getRemain(),
    });
  }

  @Schedule('* 0 * * * *')
  public async schedule() {
    await this.bot.send(
      {
        content: 'cron job',
      },
      {
        type: SendingType.GroupOrChannel,
        channelOrGroupId: 'YOUR_GROUP_ID',
      },
    );
  }
}

export default EchoModule;
