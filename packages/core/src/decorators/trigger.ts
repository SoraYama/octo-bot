import moduleInfo from '../base/info';
import BaseModule from '../base/module';
import { ITrigger, TriggerMethod } from '../types/ITrigger';
import { TClassDecoratorParams, TMethodDecoratorParams } from '../types/TDecorator';
import TypeHelper from '../utils/typeHelper';

// eslint-disable-next-line @typescript-eslint/ban-types
export default function Trigger(trigger: ITrigger | string): Function {
  return function decorate(...props: TMethodDecoratorParams | TClassDecoratorParams) {
    if (!trigger) {
      throw new Error('Trigger decorator must receive a string or trigger object');
    }
    const handledTrigger: ITrigger = {
      methods: TypeHelper.isString(trigger) ? [TriggerMethod.Prefix] : trigger.methods,
      match: TypeHelper.isString(trigger) ? trigger : trigger.match,
      onlyToMe: TypeHelper.isString(trigger) ? false : trigger.onlyToMe || false,
      helpText: TypeHelper.isString(trigger) ? 'To be implemented' : trigger.helpText || '',
    };
    // decorate class
    if (props.length === 1) {
      if (!(props[0].prototype instanceof BaseModule)) {
        throw new Error(
          `Trigger must decorate sub class of BaseModule (module name: ${props[0].name})`,
        );
      }

      moduleInfo.setModuleInfo(props[0], null, {
        modulePath: handledTrigger.match,
        helpText: handledTrigger.helpText,
      });
      return;
    }

    // decorate method
    const [target, methodName] = props;

    if (!TypeHelper.isString(methodName)) {
      return;
    }

    moduleInfo.setModuleInfo(target.constructor, methodName, { trigger: handledTrigger });
  };
}
