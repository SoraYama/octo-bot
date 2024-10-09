import { BaseModule, Service, Trigger, TriggerMethod } from '@octo-bot/core';

import EchoService from '../service/echo.service';

@Trigger('/echo')
class EchoModule extends BaseModule {
  @Service('echo')
  private echoService!: EchoService;

  @Trigger({
    match: 'test',
    methods: [TriggerMethod.Prefix],
    helpText: 'test bot',
    platforms: ['qq'],
  })
  public async echo() {
    this.bot.logger.info('enter echo');

    await this.event.reply({
      content: this.echoService.getRemain(),
    });
  }
}

export default EchoModule;
