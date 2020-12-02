import { ITrigger } from './ITrigger';

export interface IModuleMethodInfo {
  methodName?: string;
  helpText?: string;
  trigger?: ITrigger;
}

export interface IModuleInfo {
  name?: string;
  modulePath?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  clazz?: Function;
  methodMap?: Map<string, IModuleMethodInfo>;
}
