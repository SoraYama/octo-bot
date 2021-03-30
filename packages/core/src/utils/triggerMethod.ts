import { TriggerMethod } from '../types/ITrigger';

export default function triggerMethod(msg: string, match: string, method: TriggerMethod) {
  switch (method) {
    case TriggerMethod.FullMatch: {
      return msg === match;
    }
    case TriggerMethod.Keyword: {
      return msg.includes(match);
    }
    case TriggerMethod.Prefix: {
      return msg.startsWith(match);
    }
    case TriggerMethod.RegExp: {
      return new RegExp(match).test(msg);
    }
    default: {
      return false;
    }
  }
}
