/* eslint-disable @typescript-eslint/ban-types */
import { IModuleInfo, IModuleMethodInfo } from '../types/IModule';
import { ITrigger } from '../types/ITrigger';

interface IModuleInfoHelper {
  clazzName?: string;
  modulePath?: string;
  trigger?: ITrigger;
  schedule?: string;
}

class ModuleInfoManager {
  private _moduleInfoMap = new Map<unknown, IModuleInfo>();

  public getModuleInfo(clazz: unknown) {
    return this._moduleInfoMap.get(clazz);
  }

  public setModuleInfo(clazz: unknown, methodName: string | null, info: IModuleInfoHelper) {
    const clazzInfo: IModuleInfo = this._moduleInfoMap.get(clazz) || {};
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

    this._moduleInfoMap.set(clazz, { clazz, ...clazzInfo });
  }

  public get allModuleInfo() {
    return this._moduleInfoMap.values();
  }
}

const moduleInfo = new ModuleInfoManager();

export default moduleInfo;
