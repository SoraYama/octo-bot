import OctoBot from './base/bot';
import OctoEvent from './base/event';
import OctoGroup from './base/group';
import BaseModule from './base/module';
import Octo from './base/octo';
import BaseService from './base/service';
import OctoUser from './base/user';
import Schedule from './decorators/schedule';
import Service from './decorators/service';
import Trigger from './decorators/trigger';

export { IOctoBotConfig, IOctoOptions } from './types/ICore';
export { IOctoEvent } from './types/IEvent';
export { IAttachment, IOctoMessage, ISendOptions, SendingType } from './types/IMessage';
export { IModuleInfo, IModuleMethodInfo } from './types/IModule';
export { ITrigger, TriggerMethod } from './types/ITrigger';
export { IOctoUser, Priv } from './types/IUser';

export {
  Octo,
  OctoBot,
  OctoGroup,
  OctoUser,
  OctoEvent,
  BaseService,
  BaseModule,
  Service,
  Trigger,
  Schedule,
};

export default Octo;
