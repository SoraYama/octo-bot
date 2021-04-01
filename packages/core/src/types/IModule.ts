import { ITrigger } from './ITrigger';

export interface IModuleMethodInfo {
  methodName?: string;
  trigger?: ITrigger;
}

export interface IModuleInfo {
  name?: string;
  modulePath?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  clazz?: unknown;
  methodMap?: Map<string, IModuleMethodInfo>;
  helpText?: string;
}
