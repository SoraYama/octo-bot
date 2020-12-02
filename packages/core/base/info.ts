/* eslint-disable @typescript-eslint/ban-types */
import { IModuleInfo, IModuleMethodInfo } from '../types/IModule';
import { ITrigger } from '../types/ITrigger';

interface IModuleInfoHelper {
  clazzName?: string;
  modulePath?: string;
  trigger?: ITrigger;
}

class ModuleInfoManager {
  private moduleInfoMap = new Map<Function, IModuleInfo>();

  public setModuleInfo(clazz: Function, methodName: string | null, info: IModuleInfoHelper) {
    const clazzInfo: IModuleInfo = this.moduleInfoMap.get(clazz) || {};
    const { clazzName, modulePath, trigger } = info;
    if (clazzName) {
      clazzInfo.name = clazzName;
    }

    if (modulePath) {
      clazzInfo.modulePath = modulePath;
    }

    if (methodName) {
      const methodMap: Map<string, IModuleMethodInfo> = clazzInfo.methodMap || new Map();
      const methodInfo: IModuleMethodInfo = methodMap.get(methodName) || {};
      methodInfo.methodName = methodName;
      methodInfo.trigger = trigger;
      methodMap.set(methodName, methodInfo);
      clazzInfo.methodMap = methodMap;
    }

    this.moduleInfoMap.set(clazz, { clazz, ...clazzInfo });
  }

  public get allModuleInfo() {
    return this.moduleInfoMap.values();
  }
}

const moduleInfo = new ModuleInfoManager();

export default moduleInfo;
