import OctoBot from './base/bot';
import OctoGroup from './base/group';
import BaseModule from './base/module';
import Octo from './base/octo';
import BaseService from './base/service';
import Schedule from './decorators/schedule';

import Service from './decorators/service';
import Trigger from './decorators/trigger';

export { IOctoBotConfig, IOctoOptions } from './types/ICore';
export { IOctoEvent } from './types/IEvent';
export { IAttachment, IOctoMessage, ISendOptions, SendingType } from './types/IMessage';
export { IModuleInfo, IModuleMethodInfo } from './types/IModule';
export { ITrigger, TriggerMethod } from './types/ITrigger';
export { IOctoUser } from './types/IUser';

export { Octo, BaseService, BaseModule, Service, OctoBot, Trigger, OctoGroup, Schedule };

export default Octo;
