import cron from 'node-cron';

import BaseModule from '../base/module';
import schedule from '../base/schedule';
import { TClassDecoratorParams, TMethodDecoratorParams } from '../types/TDecorator';
import TypeHelper from '../utils/typeHelper';

// eslint-disable-next-line @typescript-eslint/ban-types
export default function Schedule(cronStr: string): Function {
  return function decorate(...props: TMethodDecoratorParams | TClassDecoratorParams) {
    if (!cronStr) {
      throw new Error(`Schedule decorator must receive a cron string, now: ${cronStr}`);
    }

    if (!cron.validate(cronStr)) {
      throw new Error(`Validate cron string failed: ${cronStr}`);
    }

    // decorate class
    if (props.length === 1) {
      throw new Error(`Schedule decorator must be decorate method`);
    }

    // decorate method
    const [target, methodName] = props;

    // decorate class
    if (!(target.constructor instanceof BaseModule)) {
      throw new Error(`Schedule decorator must be decorate on class extends BaseModule`);
    }

    if (!TypeHelper.isString(methodName)) {
      return;
    }

    schedule.setScheduleInfo(target.constructor, methodName, cronStr);
  };
}
