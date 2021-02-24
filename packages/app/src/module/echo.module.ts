// import { BaseModule, Schedule, SendingType, Service, Trigger, TriggerMethod } from '@octo-bot/core';
import { BaseModule, Service, Trigger, TriggerMethod } from '@octo-bot/core';
import EchoService from '../service/echo.service';

@Trigger('/echo')
class EchoModule extends BaseModule {
  @Service('echo')
  private echoService!: EchoService;

  @Trigger({ match: 'test', methods: [TriggerMethod.Prefix], helpText: '复读机一枚' })
  public async echo() {
    await this.event.reply({
      content: this.echoService.getRemain(),
    });
  }

  // @Schedule('0 * * * * *')
  // public async schedule() {
  //   await this.bot.send(
  //     {
  //       content: '测试',
  //     },
  //     {
  //       type: SendingType.GroupOrChannel,
  //       channelOrGroupId: '163716381127876608',
  //     },
  //   );
  // }
}

export default EchoModule;
