import OctoBot from './base/bot';
import OctoGroup from './base/group';
import BaseModule from './base/module';
import Octo from './base/octo';
import BaseService from './base/service';

import Service from './decorators/service';
import Trigger from './decorators/trigger';

export { IOctoBotAsUser, IOctoBotConfig, IOctoOptions } from './types/ICore';
export { IOctoEvent } from './types/IEvent';
export { IAttachment, IOctoMessage, ISendOptions, SendingType } from './types/IMessage';
export { IModuleInfo, IModuleMethodInfo } from './types/IModule';
export { ITrigger } from './types/ITrigger';
export { IBlockedUser, IOctoUser } from './types/IUser';

export { Octo, BaseService, BaseModule, Service, OctoBot, Trigger, OctoGroup };

export default Octo;
