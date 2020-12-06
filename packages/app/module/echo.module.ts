import { BaseModule, Trigger, TriggerMethod } from '@octo-bot/core';

@Trigger('/echo')
class EchoModule extends BaseModule {
  @Trigger({ match: 'test', method: [TriggerMethod.Prefix], helpText: '复读机一枚' })
  public async echo() {
    await this.event.reply({
      content: this.event.message.content,
    });
  }
}

export default EchoModule;
