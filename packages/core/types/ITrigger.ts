export enum TriggerMethod {
  FullMatch = 0,
  Prefix,
  Keyword,
  RegExp,
}

export interface ITrigger {
  method: TriggerMethod[];
  match: string;
}
