import { BaseModule, Trigger } from '@octo-bot/core';

@Trigger('/echo')
class EchoModule extends BaseModule {
  @Trigger('test')
  public async echo() {
    await this.event.reply({
      content: this.event.message.content,
    });
  }
}

export default EchoModule;
