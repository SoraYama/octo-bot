/* eslint-disable @typescript-eslint/ban-types */
import BaseModule from '../base/module';
import ServiceLoader from '../loaders/serviceLoader';
import TypeHelper from '../utils/typeHelper';

export default function Service(service: string | Function): Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function decorate(target: Function, property: string, desc: PropertyDescriptor): any {
    const serviceName = TypeHelper.isString(service) ? service : service.name;

    if (!(target instanceof BaseModule) || !TypeHelper.isUndef(desc)) {
      throw new Error(
        `Please check @Service(${serviceName})/${property} used on Module's property, and Module extends BaseModule.`,
      );
    }

    return {
      get() {
        const serviceClass = TypeHelper.isString(service)
          ? ServiceLoader.serviceMap.get(service)
          : service;

        if (!serviceClass)
          throw new Error(`Please check ${service}.service.ts is exists and extends BaseService.`);

        return Reflect.construct(serviceClass, [this.bot, this.event]);
      },
    };
  };
}
